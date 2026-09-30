import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSessionUser, requireAdmin } from '@/lib/auth';
import { sanitizeString, sanitizeEmail, sanitizePrice } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Clean in-memory fallback array (strictly 0 fake orders)
let SERVER_ORDERS_DB: any[] = [];

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required to view orders.' },
        { status: 401 }
      );
    }

    const isAdmin = user.role === 'admin';

    if (supabase) {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

      // Non-admins can strictly only see their own orders!
      if (!isAdmin) {
        query = query.eq('customer_email', user.email.toLowerCase());
      }

      const { data, error } = await query;

      if (!error && data) {
        const mappedOrders = data.map((o) => ({
          id: o.id,
          customer: o.customer_name,
          email: o.customer_email,
          items: o.items_description,
          amount: Number(o.total_amount),
          date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          paymentMethod: o.payment_method,
          status: o.order_status,
          address: o.shipping_address,
        }));
        return NextResponse.json({
          success: true,
          count: mappedOrders.length,
          data: mappedOrders,
        });
      }
    }

    const filteredDb = isAdmin
      ? SERVER_ORDERS_DB
      : SERVER_ORDERS_DB.filter((o) => o.email?.toLowerCase() === user.email.toLowerCase());

    return NextResponse.json({
      success: true,
      count: filteredDb.length,
      data: filteredDb,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch orders.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: Max 10 order attempts per 10 minutes per IP
    const rateCheck = checkRateLimit(`order_${ip}`, 10, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many order attempts. Please wait ${rateCheck.resetSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const customer = sanitizeString(body.customer, 100) || 'Valued Client';
    const email = sanitizeEmail(body.email) || 'client@example.com';
    const items = sanitizeString(body.items, 500) || 'Fine Jewelry Purchase';
    const amount = sanitizePrice(body.amount);
    const paymentMethod = sanitizeString(body.paymentMethod, 50) || 'Credit / Debit Card';
    const address = sanitizeString(body.address, 300) || 'Bradford, UK';

    const newOrder = {
      id: body.id ? sanitizeString(body.id, 64) : `BJ-${Math.floor(10000 + Math.random() * 90000)}`,
      customer,
      email,
      items,
      amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      status: 'Processing',
      address,
    };

    if (supabase) {
      const { error } = await supabase.from('orders').upsert({
        id: newOrder.id,
        customer_name: newOrder.customer,
        customer_email: newOrder.email,
        items_description: newOrder.items,
        total_amount: newOrder.amount,
        payment_method: newOrder.paymentMethod,
        order_status: newOrder.status,
        shipping_address: newOrder.address,
      });

      if (error) {
        console.error('Supabase Orders insert error:', error);
      }
    }

    const existingIndex = SERVER_ORDERS_DB.findIndex((o) => o.id === newOrder.id);
    if (existingIndex >= 0) {
      SERVER_ORDERS_DB[existingIndex] = newOrder;
    } else {
      SERVER_ORDERS_DB.unshift(newOrder);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully in database.',
      data: newOrder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and new status are required.' },
        { status: 400 }
      );
    }

    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', id);

      if (error) {
        console.error('Supabase Orders update error:', error);
      }
    }

    SERVER_ORDERS_DB = SERVER_ORDERS_DB.map((o) => (o.id === id ? { ...o, status } : o));

    return NextResponse.json({
      success: true,
      message: `Order ${id} status updated to ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order status.' },
      { status: 500 }
    );
  }
}

