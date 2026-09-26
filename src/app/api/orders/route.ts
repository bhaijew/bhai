import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Clean in-memory fallback array (strictly 0 fake orders)
let SERVER_ORDERS_DB: any[] = [];

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

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
  } catch (err) {
    console.error('Supabase Orders fetch error:', err);
  }

  return NextResponse.json({
    success: true,
    count: SERVER_ORDERS_DB.length,
    data: SERVER_ORDERS_DB,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      id: body.id || `BJ-${Math.floor(10000 + Math.random() * 90000)}`,
      customer: body.customer || 'Guest Client',
      email: body.email || 'client@example.com',
      items: body.items || 'Fine Jewelry Purchase',
      amount: Number(body.amount || 0),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: body.paymentMethod || 'Credit Card',
      status: body.status || 'Processing',
      address: body.address || 'Standard Delivery Address',
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

