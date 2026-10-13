import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'client';
  createdAt?: string;
  loginTime?: string;
  exp?: number;
}

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'bhai_jeweller_super_secure_vault_secret_bradford_2026';

export const SESSION_COOKIE_NAME = 'bhai_auth_session';

/**
 * Enterprise password hashing with PBKDF2-SHA512 (100,000 iterations, random salt)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `pbkdf2$100000$${salt}$${hash}`;
}

/**
 * Timing-safe password verification supporting both PBKDF2 and legacy SHA-256
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // Modern PBKDF2 hash format
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHash = parts[3];
    const derived = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
    const bufA = Buffer.from(derived);
    const bufB = Buffer.from(originalHash);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }

  // Legacy SHA-256 fallback with timing-safe comparison
  const legacyHash = crypto.createHash('sha256').update(password + 'BHAI_JEWELLER_SALT_2026').digest('hex');
  const bufA = Buffer.from(legacyHash);
  const bufB = Buffer.from(storedHash);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Signs a session payload with HMAC-SHA256 to prevent client-side tampering
 */
export function signSession(payload: Omit<SessionUser, 'exp'>, expiresInDays = 7): string {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const data: SessionUser = { ...payload, exp };
  const json = JSON.stringify(data);
  const dataBase64 = Buffer.from(json).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(dataBase64).digest('base64url');
  return `${dataBase64}.${signature}`;
}

/**
 * Verifies and decodes a signed session token
 */
export function verifySession(token: string | undefined | null): SessionUser | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) {
    // Legacy fallback: check if raw JSON, but do NOT grant admin if untrusted
    try {
      const parsed = JSON.parse(token);
      if (parsed && parsed.email && parsed.role === 'client') {
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  }

  const [dataBase64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(dataBase64)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const json = Buffer.from(dataBase64, 'base64url').toString('utf8');
    const user: SessionUser = JSON.parse(json);

    // Check expiration
    if (user.exp && Date.now() > user.exp) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Gets verified session user from incoming Request or Next.js cookies
 */
export async function getSessionUser(request?: Request | NextRequest): Promise<SessionUser | null> {
  let token: string | undefined;

  if (request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (match) {
      token = decodeURIComponent(match.substring(`${SESSION_COOKIE_NAME}=`.length));
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      const cookie = cookieStore.get(SESSION_COOKIE_NAME);
      token = cookie?.value;
    } catch {
      // Cookies() might fail outside request context
    }
  }

  return verifySession(token);
}

/**
 * Guard utility for server API routes requiring Admin access
 */
export async function requireAdmin(
  request?: Request | NextRequest
): Promise<{ authorized: boolean; user: SessionUser | null; errorResponse?: NextResponse }> {
  // Support direct admin key authentication via header
  if (request) {
    const adminKey = request.headers.get('x-admin-key');
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.ADMIN_PASSWORD;
    if (expectedKey && (adminKey === expectedKey || authHeader === `Bearer ${expectedKey}`)) {
      return {
        authorized: true,
        user: {
          id: 'admin-key-session',
          email: process.env.ADMIN_EMAIL || 'admin@bhaijeweller.com',
          name: 'Administrator',
          role: 'admin',
        },
      };
    }
  }

  const user = await getSessionUser(request);

  if (!user) {
    return {
      authorized: false,
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      ),
    };
  }

  if (user.role !== 'admin') {
    return {
      authorized: false,
      user,
      errorResponse: NextResponse.json(
        { success: false, error: 'Forbidden: Administrator privileges required.' },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user };
}

/**
 * Guard utility for routes requiring any authenticated user
 */
export async function requireAuth(
  request?: Request | NextRequest
): Promise<{ authorized: boolean; user: SessionUser | null; errorResponse?: NextResponse }> {
  const user = await getSessionUser(request);

  if (!user) {
    return {
      authorized: false,
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Please log in to proceed.' },
        { status: 401 }
      ),
    };
  }

  return { authorized: true, user };
}
