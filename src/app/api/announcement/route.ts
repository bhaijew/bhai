import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

let SERVER_ANNOUNCEMENT_CONFIG = {
  isEnabled: true,
  messages: [
    'Free worldwide shipping on all orders over £150  |  Handcrafted with passion in the UK',
    'Complimentary luxury gift packaging on every order  |  Bespoke service',
    'Fine jewellery showroom in Bradford, West Yorkshire  |  Private viewings available',
  ],
};

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('*')
        .eq('id', 'main_announcement')
        .single();

      if (!error && data) {
        SERVER_ANNOUNCEMENT_CONFIG = {
          isEnabled: data.is_enabled ?? SERVER_ANNOUNCEMENT_CONFIG.isEnabled,
          messages: Array.isArray(data.messages) ? data.messages : SERVER_ANNOUNCEMENT_CONFIG.messages,
        };
      }
    }
  } catch (err) {
    console.error('Supabase Announcement fetch error:', err);
  }

  return NextResponse.json({
    success: true,
    data: SERVER_ANNOUNCEMENT_CONFIG,
  });
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    const body = await request.json();

    const updatedConfig = {
      isEnabled: body.isEnabled ?? SERVER_ANNOUNCEMENT_CONFIG.isEnabled,
      messages: Array.isArray(body.messages) && body.messages.length > 0
        ? body.messages
        : SERVER_ANNOUNCEMENT_CONFIG.messages,
    };

    SERVER_ANNOUNCEMENT_CONFIG = updatedConfig;

    if (supabase) {
      const { error } = await supabase.from('announcement_bar').upsert({
        id: 'main_announcement',
        is_enabled: updatedConfig.isEnabled,
        messages: updatedConfig.messages,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Supabase Announcement update error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement bar settings updated successfully in real-time database.',
      data: SERVER_ANNOUNCEMENT_CONFIG,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update announcement bar.' },
      { status: 500 }
    );
  }
}
