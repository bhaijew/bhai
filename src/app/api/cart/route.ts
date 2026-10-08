import { NextResponse } from 'next/server';
import { getCartById, saveCart, verifyCheckoutToken, CartRecord } from '@/lib/cartService';
import { getSessionUser } from '@/lib/auth';
import { sanitizeString, sanitizePrice } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = sanitizeString(searchParams.get('id') || searchParams.get('cartId'), 64);
    const token = sanitizeString(searchParams.get('token'), 64);

    if (!cartId) {
      return NextResponse.json(
        { success: false, code: 'MISSING_CART_ID', message: 'Cart ID is required.' },
        { status: 400 }
      );
    }

    const cart = await getCartById(cartId);
    if (!cart) {
      return NextResponse.json(
        { success: false, code: 'CART_NOT_FOUND', message: 'Cart was not found.' },
        { status: 404 }
      );
    }

    // Security: Only allow access if valid token is provided OR user is logged in as the owner
    const user = await getSessionUser(request);
    const isOwner =
      user &&
      (user.id.toLowerCase() === cart.customerId.toLowerCase() ||
        user.email.toLowerCase() === cart.customerEmail.toLowerCase() ||
        user.role === 'admin');

    const isValidToken = token ? verifyCheckoutToken(token, cart.id, cart.customerId) : false;

    if (!isOwner && !isValidToken) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Access denied to this cart.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: error.message || 'Failed to fetch cart.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`cart_sync_${ip}`, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const user = await getSessionUser(request);

    const customerId = sanitizeString(body.customerId || user?.id || `usr-${Date.now()}`, 64);
    const customerEmail = sanitizeString(body.customerEmail || user?.email || '', 150);
    const customerPhone = sanitizeString(body.customerPhone || user?.phone || '', 50);
    const customerName = sanitizeString(body.customerName || user?.name || '', 150);

    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = items.reduce(
      (sum: number, it: any) => sum + sanitizePrice(it.price) * (Number(it.quantity) || 1),
      0
    );

    const cartId = sanitizeString(body.id || body.cartId || `cart-${Date.now()}`, 64);

    const cartRecord: CartRecord = {
      id: cartId,
      customerId,
      customerEmail: customerEmail || 'guest@example.com',
      customerPhone: customerPhone || undefined,
      customerName: customerName || undefined,
      items: items.map((it: any) => ({
        id: sanitizeString(it.id, 64),
        name: sanitizeString(it.name, 200),
        variant: sanitizeString(it.variant, 100),
        price: sanitizePrice(it.price),
        quantity: Math.max(1, Number(it.quantity) || 1),
        image: sanitizeString(it.image, 500),
        slug: sanitizeString(it.slug, 200),
      })),
      subtotal,
      currency: 'GBP',
      status: 'active',
      recoveryStatus: 'active',
      offeredDiscountPercent: 0,
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveCart(cartRecord);

    return NextResponse.json({
      success: true,
      cart: saved,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save cart.' },
      { status: 500 }
    );
  }
}
