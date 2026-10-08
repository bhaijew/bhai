import { NextResponse } from 'next/server';
import { getAbandonedCarts, updateCartStatus, CartRecoveryStatus } from '@/lib/cartService';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/sanitize';
import crypto from 'crypto';

/**
 * Validates either Admin cookie session OR Vapi secret key
 */
async function isAuthorized(request: Request): Promise<boolean> {
  const configuredSecret = process.env.VAPI_SECRET_KEY || process.env.VAPI_WEBHOOK_SECRET;

  const authHeader = request.headers.get('authorization') || '';
  if (configuredSecret && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (
      token.length === configuredSecret.length &&
      crypto.timingSafeEqual(Buffer.from(token), Buffer.from(configuredSecret))
    ) {
      return true;
    }
  }

  const customHeader = request.headers.get('x-vapi-secret') || '';
  if (
    configuredSecret &&
    customHeader &&
    customHeader.length === configuredSecret.length &&
    crypto.timingSafeEqual(Buffer.from(customHeader), Buffer.from(configuredSecret))
  ) {
    return true;
  }

  // Check admin session
  const adminCheck = await requireAdmin(request);
  if (adminCheck.authorized) {
    return true;
  }

  return !configuredSecret; // Allow local testing if secret not yet configured
}

export async function GET(request: Request) {
  try {
    const authorized = await isAuthorized(request);
    if (!authorized) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const inactiveMinutes = searchParams.get('inactiveMinutes')
      ? Number(searchParams.get('inactiveMinutes'))
      : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;

    const abandonedCarts = await getAbandonedCarts({ inactiveMinutes, limit });

    return NextResponse.json({
      success: true,
      count: abandonedCarts.length,
      carts: abandonedCarts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to query abandoned carts.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authorized = await isAuthorized(request);
    if (!authorized) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Unauthorized access.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const cartId = sanitizeString(body.cartId || body.id, 64);
    const status = sanitizeString(body.status, 50) as CartRecoveryStatus;

    if (!cartId || !status) {
      return NextResponse.json(
        { success: false, message: 'cartId and status are required.' },
        { status: 400 }
      );
    }

    const validStatuses: CartRecoveryStatus[] = [
      'active',
      'abandoned',
      'contact_pending',
      'contacted',
      'interested',
      'coupon_offered',
      'checkout_sent',
      'converted',
      'not_interested',
      'opted_out',
      'expired',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid recovery status: ${status}` },
        { status: 400 }
      );
    }

    const updated = await updateCartStatus(cartId, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Cart was not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Cart ${cartId} recovery status updated to ${status}.`,
      cart: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update cart status.' },
      { status: 500 }
    );
  }
}
