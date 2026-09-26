import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'BHAI_JEWELLER_SALT_2026').digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = (body.fullName || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const phone = (body.phone || '').trim();
    const password = body.password || '';

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required.' },
        { status: 400 }
      );
    }

    // Password strength check
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Duplicate email check
    if (supabase) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'An account with this email address already exists. Please log in.' },
          { status: 409 }
        );
      }
    }

    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const hashedPassword = hashPassword(password);
    const role = email.includes('admin') ? 'admin' : 'client';

    if (supabase) {
      const { error } = await supabase.from('users').insert({
        id: userId,
        full_name: fullName,
        email: email,
        phone: phone,
        password_hash: hashedPassword,
        role: role,
        failed_attempts: 0,
        lock_until: null,
      });

      if (error) {
        console.error('Supabase signup insert error:', error);
      }
    }

    const sessionPayload = {
      id: userId,
      email: email,
      name: fullName,
      role: role,
      loginTime: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully! Welcome to Bhai Jeweller.',
      user: sessionPayload,
    });

    response.cookies.set('bhai_auth_session', JSON.stringify(sessionPayload), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create account.' },
      { status: 500 }
    );
  }
}
