import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Clean in-memory fallback array (strictly 0 fake enquiries)
let SERVER_ENQUIRIES_DB: any[] = [];

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }
    if (supabase) {
      const { data, error } = await supabase
        .from('bespoke_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedEnquiries = data.map((e) => ({
          id: e.id,
          name: e.client_name,
          email: e.client_email,
          phone: e.client_phone,
          service: e.service_requested,
          budget: e.estimated_budget,
          date: e.created_at ? e.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          message: e.design_notes || '',
          status: e.enquiry_status,
        }));
        return NextResponse.json({
          success: true,
          count: mappedEnquiries.length,
          data: mappedEnquiries,
        });
      }
    }
  } catch (err) {
    console.error('Supabase Enquiries fetch error:', err);
  }

  return NextResponse.json({
    success: true,
    count: SERVER_ENQUIRIES_DB.length,
    data: SERVER_ENQUIRIES_DB,
  });
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: Max 5 enquiries per 10 minutes per IP to block spam bots
    const rateCheck = checkRateLimit(`enquiry_${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many enquiries submitted. Please wait ${rateCheck.resetSeconds} seconds before sending another message.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = sanitizeString(body.name, 100) || 'Valued Client';
    const email = sanitizeEmail(body.email) || 'client@example.com';
    const phone = sanitizePhone(body.phone) || '+44 7700 900000';
    const service = sanitizeString(body.service, 100) || 'Bespoke Jewelry Customization';
    const budget = sanitizeString(body.budget, 50) || '£2,000 - £5,000';
    const message = sanitizeString(body.message, 2000);

    const newEnquiry = {
      id: body.id ? sanitizeString(body.id, 64) : `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      phone,
      service,
      budget,
      date: new Date().toISOString().split('T')[0],
      message,
      status: 'New',
    };

    if (supabase) {
      const { error } = await supabase.from('bespoke_enquiries').upsert({
        id: newEnquiry.id,
        client_name: newEnquiry.name,
        client_email: newEnquiry.email,
        client_phone: newEnquiry.phone,
        service_requested: newEnquiry.service,
        estimated_budget: newEnquiry.budget,
        design_notes: newEnquiry.message,
        enquiry_status: newEnquiry.status,
      });

      if (error) {
        console.error('Supabase Enquiries insert error:', error);
      }
    }

    const existingIndex = SERVER_ENQUIRIES_DB.findIndex((e) => e.id === newEnquiry.id);
    if (existingIndex >= 0) {
      SERVER_ENQUIRIES_DB[existingIndex] = newEnquiry;
    } else {
      SERVER_ENQUIRIES_DB.unshift(newEnquiry);
    }

    return NextResponse.json({
      success: true,
      message: 'Bespoke enquiry submitted successfully to database.',
      data: newEnquiry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit enquiry.' },
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
        { success: false, error: 'Enquiry ID and status are required.' },
        { status: 400 }
      );
    }

    if (supabase) {
      const { error } = await supabase
        .from('bespoke_enquiries')
        .update({ enquiry_status: status })
        .eq('id', id);

      if (error) {
        console.error('Supabase Enquiries update error:', error);
      }
    }

    SERVER_ENQUIRIES_DB = SERVER_ENQUIRIES_DB.map((e) => (e.id === id ? { ...e, status } : e));

    return NextResponse.json({
      success: true,
      message: `Enquiry ${id} status updated to ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update enquiry status.' },
      { status: 500 }
    );
  }
}

