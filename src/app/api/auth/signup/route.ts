import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword, signSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: Max 5 registration attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(`signup_${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many account registration attempts. Please try again in ${Math.ceil(rateCheck.resetSeconds / 60)} minute(s).`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const fullName = sanitizeString(body.fullName, 100);
    const email = sanitizeEmail(body.email);
    const phone = sanitizePhone(body.phone);
    const password = body.password || '';

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Valid full name, email address, and password are required.' },
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
    // Security: New registrations are ALWAYS client role. Admin privileges cannot be self-assigned.
    const role: 'client' = 'client';

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
      phone: phone,
      role,
      createdAt: new Date().toISOString(),
      loginTime: new Date().toISOString(),
    };

    const signedToken = signSession(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully! Welcome to Bhai Jeweller.',
      user: sessionPayload,
    });

    response.cookies.set(SESSION_COOKIE_NAME, signedToken, {
      httpOnly: true,
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
