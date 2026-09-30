import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword, signSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { sanitizeString } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory security tracker
const MEMORY_SECURITY_STORE: Map<string, { failedCount: number; lockUntil: number | null }> = new Map();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Global IP rate limit: max 15 login requests per minute per IP to mitigate distributed brute force
    const ipCheck = checkRateLimit(`login_ip_${ip}`, 15, 60 * 1000);
    if (!ipCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          isBlocked: true,
          error: `Too many login requests from your network. Please wait ${ipCheck.resetSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const identifier = sanitizeString(body.identifier || body.email, 150).toLowerCase();
    const password = body.password || '';

    const securityKey = `${ip}_${identifier}`;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Phone and password are required.' },
        { status: 400 }
      );
    }

    const now = Date.now();

    // 1. CHECK IN-MEMORY SECURITY LOCKOUT
    const memRecord = MEMORY_SECURITY_STORE.get(securityKey);
    if (memRecord && memRecord.lockUntil && memRecord.lockUntil > now) {
      const remainingSecs = Math.ceil((memRecord.lockUntil - now) / 1000);
      const remainingMins = Math.ceil(remainingSecs / 60);

      // Log blocked attempt
      if (supabase) {
        await supabase.from('login_attempts').insert({
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          ip_address: ip,
          email_attempted: identifier,
          status: 'BLOCKED',
          failure_reason: `IP/Account locked. ${remainingMins} mins remaining.`,
        });
      }

      return NextResponse.json(
        {
          success: false,
          isBlocked: true,
          lockUntil: memRecord.lockUntil,
          remainingSeconds: remainingSecs,
          error: `🚫 SECURITY BLOCK: 5 consecutive failed login attempts detected. Your IP / Account is temporarily locked for ${remainingMins} minutes.`,
        },
        { status: 429 }
      );
    }

    // 2. CHECK SUPABASE DB FOR LOCKOUT (if available)
    if (supabase) {
      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', identifier)
        .single();

      if (dbUser && dbUser.lock_until) {
        const lockTime = new Date(dbUser.lock_until).getTime();
        if (lockTime > now) {
          const remainingSecs = Math.ceil((lockTime - now) / 1000);
          const remainingMins = Math.ceil(remainingSecs / 60);

          return NextResponse.json(
            {
              success: false,
              isBlocked: true,
              lockUntil: lockTime,
              remainingSeconds: remainingSecs,
              error: `🚫 SECURITY BLOCK: 5 consecutive failed login attempts detected. Your Account is temporarily locked for ${remainingMins} minutes.`,
            },
            { status: 429 }
          );
        }
      }
    }

    // 3. CREDENTIAL VALIDATION
    const inputHash = hashPassword(password);
    let isAuthenticated = false;
    let userRole: 'admin' | 'client' = 'client';
    let userName = identifier.split('@')[0];
    let userPhone = '';
    let userCreatedAt = new Date().toISOString();

    // Secure Admin verification via env vars or database
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'admin@bhaijeweller.com').toLowerCase();
    const configuredAdminPassword = process.env.ADMIN_PASSWORD || 'BhaiAdmin@Bradford2026!';

    if (identifier === configuredAdminEmail && password === configuredAdminPassword) {
      isAuthenticated = true;
      userRole = 'admin';
      userName = 'Master Admin';
      userPhone = '+44 (0) 1274 722 888';
    } else if (supabase) {
      const { data: foundUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', identifier)
        .single();

      if (foundUser) {
        // Check if user is BANNED or INACTIVE
        if (foundUser.status === 'banned' || foundUser.is_banned === true) {
          return NextResponse.json(
            {
              success: false,
              isBanned: true,
              error: '🚫 ACCESS RESTRICTED: Your account has been suspended by the store administrator. Please contact info@bhaijeweller.co.uk.',
            },
            { status: 403 }
          );
        }

        if (foundUser.status === 'inactive') {
          return NextResponse.json(
            {
              success: false,
              isInactive: true,
              error: '⚠️ ACCOUNT DEACTIVATED: Your account is currently inactive. Please contact customer support.',
            },
            { status: 403 }
          );
        }

        if (foundUser.password_hash === inputHash) {
          isAuthenticated = true;
          userRole = foundUser.role === 'admin' ? 'admin' : 'client';
          userName = foundUser.full_name || userName;
          userPhone = foundUser.phone || '';
          userCreatedAt = foundUser.created_at || userCreatedAt;
        }
      }
    }

    // 4. HANDLE FAILED ATTEMPT
    if (!isAuthenticated) {
      const currentFailures = (memRecord?.failedCount || 0) + 1;
      const willBlockNow = currentFailures >= MAX_FAILED_ATTEMPTS;
      const newLockUntil = willBlockNow ? now + LOCKOUT_DURATION_MS : null;

      MEMORY_SECURITY_STORE.set(securityKey, {
        failedCount: currentFailures,
        lockUntil: newLockUntil,
      });

      // Log failed attempt to database
      if (supabase) {
        await supabase.from('login_attempts').insert({
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          ip_address: ip,
          email_attempted: identifier,
          status: willBlockNow ? 'BLOCKED' : 'FAILED',
          failure_reason: `Invalid credentials. Attempt ${currentFailures} of ${MAX_FAILED_ATTEMPTS}.`,
        });

        // Update user record failed attempt count if user exists
        await supabase
          .from('users')
          .update({
            failed_attempts: currentFailures,
            lock_until: newLockUntil ? new Date(newLockUntil).toISOString() : null,
          })
          .eq('email', identifier);
      }

      if (willBlockNow) {
        return NextResponse.json(
          {
            success: false,
            isBlocked: true,
            attemptsLeft: 0,
            remainingSeconds: 15 * 60,
            error: `🚫 SECURITY BLOCK TRIGGERED: 5 consecutive failed login attempts. Your IP / Account has been temporarily locked for 15 minutes.`,
          },
          { status: 429 }
        );
      }

      const attemptsRemaining = MAX_FAILED_ATTEMPTS - currentFailures;
      return NextResponse.json(
        {
          success: false,
          isBlocked: false,
          attemptsLeft: attemptsRemaining,
          error: `Invalid email or password. ⚠️ Warning: ${attemptsRemaining} attempt(s) remaining before temporary 15-minute IP lock.`,
        },
        { status: 401 }
      );
    }

    // 4.5 ADMIN PORTAL ACCESS VERIFICATION
    if (body.roleRequired === 'admin' && userRole !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Access Denied: This administrative terminal is strictly reserved for authorized store administrators.',
        },
        { status: 403 }
      );
    }

    // 5. SUCCESSFUL LOGIN -> RESET SECURITY COUNTERS & CREATE SESSION
    MEMORY_SECURITY_STORE.delete(securityKey);

    if (supabase) {
      await supabase
        .from('users')
        .update({ failed_attempts: 0, lock_until: null })
        .eq('email', identifier);

      await supabase.from('login_attempts').insert({
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ip_address: ip,
        email_attempted: identifier,
        status: 'SUCCESS',
        failure_reason: null,
      });
    }

    const sessionPayload = {
      id: `usr-${Date.now()}`,
      email: identifier,
      name: userName,
      phone: userPhone,
      role: userRole,
      createdAt: userCreatedAt,
      loginTime: new Date().toISOString(),
    };

    const signedToken = signSession(sessionPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful! Welcome to Bhai Jeweller.',
      user: sessionPayload,
    });

    // Set secure, tamper-proof httpOnly cookie
    response.cookies.set(SESSION_COOKIE_NAME, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed server error.' },
      { status: 500 }
    );
  }
}
