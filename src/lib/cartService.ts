import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { SITE_URL } from './constants';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase as defaultSupabase } from '@/lib/supabase';

const supabase = supabaseAdmin || defaultSupabase;

export interface StoredCartItem {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
}

export type CartRecoveryStatus =
  | 'active'
  | 'abandoned'
  | 'contact_pending'
  | 'contacted'
  | 'interested'
  | 'coupon_offered'
  | 'checkout_sent'
  | 'converted'
  | 'not_interested'
  | 'opted_out'
  | 'expired';

export interface CartRecord {
  id: string;
  customerId: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  items: StoredCartItem[];
  subtotal: number;
  currency: string;
  status: CartRecoveryStatus;
  recoveryStatus: CartRecoveryStatus;
  offeredDiscountPercent: number;
  checkoutUrl?: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
}

// In-memory fallback cart database (matches project's architectural convention in orders/products)
let SERVER_CARTS_DB: CartRecord[] = [];

// Secret for signing checkout tokens to verify link integrity
const CHECKOUT_SECRET =
  process.env.CHECKOUT_TOKEN_SECRET ||
  process.env.AUTH_SECRET ||
  'bhai_jeweller_secure_checkout_token_2026';

/**
 * Generates an HMAC token for tamper-proof checkout URLs
 */
export function signCheckoutToken(cartId: string, customerId: string): string {
  return crypto
    .createHmac('sha256', CHECKOUT_SECRET)
    .update(`${cartId}:${customerId}`)
    .digest('hex')
    .substring(0, 32);
}

/**
 * Verifies a checkout token
 */
export function verifyCheckoutToken(token: string, cartId: string, customerId: string): boolean {
  if (!token) return false;
  const expected = signCheckoutToken(cartId, customerId);
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

/**
 * Generates an official, non-fake checkout URL using the existing checkout architecture
 */
export function generateSecureCheckoutUrl(cart: CartRecord, customBaseUrl?: string): string {
  const baseUrl = (customBaseUrl || process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/+$/, '');
  const token = signCheckoutToken(cart.id, cart.customerId);
  const params = new URLSearchParams({
    cartId: cart.id,
    token,
  });

  if (cart.offeredDiscountPercent > 0) {
    params.set('discount', cart.offeredDiscountPercent.toString());
  }

  return `${baseUrl}/checkout?${params.toString()}`;
}

/**
 * Finds customer by ID or Email from Supabase or memory store
 */
export async function findCustomer(customerIdOrEmail: string): Promise<CustomerRecord | null> {
  if (!customerIdOrEmail || typeof customerIdOrEmail !== 'string') return null;
  const identifier = customerIdOrEmail.trim().toLowerCase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, phone, role, status')
        .or(`id.eq.${customerIdOrEmail},email.eq.${identifier}`)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.full_name || 'Valued Client',
          email: data.email,
          phone: data.phone || undefined,
          role: data.role || 'client',
          status: data.status || 'active',
        };
      }
    } catch {
      // Fallback to in-memory check
    }
  }

  // Fallback to checking carts store for previously recorded customer details
  const matchingCart = SERVER_CARTS_DB.find(
    (c) =>
      c.customerId.toLowerCase() === identifier ||
      c.customerEmail.toLowerCase() === identifier
  );

  if (matchingCart) {
    return {
      id: matchingCart.customerId,
      name: matchingCart.customerName || 'Valued Client',
      email: matchingCart.customerEmail,
      phone: matchingCart.customerPhone,
      role: 'client',
      status: 'active',
    };
  }

  return null;
}

/**
 * Fetches a cart by ID
 */
export async function getCartById(cartId: string): Promise<CartRecord | null> {
  if (!cartId || typeof cartId !== 'string') return null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('id', cartId)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          customerId: data.customer_id,
          customerEmail: data.customer_email,
          customerPhone: data.customer_phone || undefined,
          customerName: data.customer_name || undefined,
          items: Array.isArray(data.items) ? data.items : [],
          subtotal: Number(data.subtotal || 0),
          currency: data.currency || 'GBP',
          status: data.status as CartRecoveryStatus,
          recoveryStatus: (data.recovery_status || data.status) as CartRecoveryStatus,
          offeredDiscountPercent: Number(data.offered_discount_percent || 0),
          checkoutUrl: data.checkout_url || undefined,
          lastActivityAt: data.last_activity_at || new Date().toISOString(),
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        };
      }
    } catch {
      // Fall through to memory store
    }
  }

  const found = SERVER_CARTS_DB.find((c) => c.id === cartId);
  return found ? { ...found } : null;
}

/**
 * Saves or updates a cart in database and memory fallback
 */
export async function saveCart(cart: CartRecord): Promise<CartRecord> {
  const updated: CartRecord = {
    ...cart,
    updatedAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('carts').upsert({
        id: updated.id,
        customer_id: updated.customerId,
        customer_email: updated.customerEmail,
        customer_phone: updated.customerPhone || null,
        customer_name: updated.customerName || null,
        items: updated.items,
        subtotal: updated.subtotal,
        currency: updated.currency,
        status: updated.status,
        recovery_status: updated.recoveryStatus,
        offered_discount_percent: updated.offeredDiscountPercent,
        checkout_url: updated.checkoutUrl || null,
        last_activity_at: updated.lastActivityAt,
        created_at: updated.createdAt,
        updated_at: updated.updatedAt,
      });
    } catch (e) {
      console.error('Supabase cart upsert error:', e);
    }
  }

  const idx = SERVER_CARTS_DB.findIndex((c) => c.id === updated.id);
  if (idx >= 0) {
    SERVER_CARTS_DB[idx] = updated;
  } else {
    SERVER_CARTS_DB.push(updated);
  }

  return updated;
}

/**
 * Updates status and optional metadata on an existing cart
 */
export async function updateCartStatus(
  cartId: string,
  newStatus: CartRecoveryStatus,
  extra: Partial<CartRecord> = {}
): Promise<CartRecord | null> {
  const cart = await getCartById(cartId);
  if (!cart) return null;

  const updated: CartRecord = {
    ...cart,
    status: newStatus,
    recoveryStatus: newStatus,
    ...extra,
    updatedAt: new Date().toISOString(),
  };

  return saveCart(updated);
}

/**
 * Identifies abandoned carts eligible for Vapi voice outreach:
 * - Customer is known
 * - Cart contains products
 * - Checkout/order not completed
 * - Inactive for configured duration
 */
export async function getAbandonedCarts(options: {
  inactiveMinutes?: number;
  limit?: number;
} = {}): Promise<CartRecord[]> {
  const inactiveMinutes =
    options.inactiveMinutes ??
    Number(process.env.ABANDONED_CART_INACTIVE_MINUTES || 30);
  const limit = options.limit ?? 50;

  const cutoff = new Date(Date.now() - inactiveMinutes * 60 * 1000).toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .neq('status', 'converted')
        .neq('status', 'opted_out')
        .lte('last_activity_at', cutoff)
        .order('last_activity_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data
          .map((row) => ({
            id: row.id,
            customerId: row.customer_id,
            customerEmail: row.customer_email,
            customerPhone: row.customer_phone || undefined,
            customerName: row.customer_name || undefined,
            items: Array.isArray(row.items) ? row.items : [],
            subtotal: Number(row.subtotal || 0),
            currency: row.currency || 'GBP',
            status: row.status as CartRecoveryStatus,
            recoveryStatus: (row.recovery_status || row.status) as CartRecoveryStatus,
            offeredDiscountPercent: Number(row.offered_discount_percent || 0),
            checkoutUrl: row.checkout_url || undefined,
            lastActivityAt: row.last_activity_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }))
          .filter((c) => c.items.length > 0 && Boolean(c.customerId));
      }
    } catch {
      // Fall through to memory
    }
  }

  return SERVER_CARTS_DB.filter((c) => {
    const isInactive = new Date(c.lastActivityAt).getTime() <= new Date(cutoff).getTime();
    const hasItems = c.items && c.items.length > 0;
    const notCompleted = c.status !== 'converted' && c.status !== 'opted_out';
    const hasCustomer = Boolean(c.customerId);
    return isInactive && hasItems && notCompleted && hasCustomer;
  }).slice(0, limit);
}

/**
 * Validates whether all products in the cart are in stock
 */
export async function validateCartStock(
  cart: CartRecord
): Promise<{ valid: boolean; outOfStockItems: string[] }> {
  if (!cart.items || cart.items.length === 0) {
    return { valid: false, outOfStockItems: ['Cart is empty'] };
  }

  const outOfStockItems: string[] = [];

  for (const item of cart.items) {
    if (supabase) {
      try {
        const { data: prod } = await supabase
          .from('products')
          .select('stock, status')
          .eq('id', item.id)
          .single();

        if (prod) {
          if (prod.stock < item.quantity || prod.status === 'Out of Stock') {
            outOfStockItems.push(item.name || item.id);
          }
          continue;
        }
      } catch {
        // Fallback: assume available if DB fetch fails
      }
    }
  }

  return {
    valid: outOfStockItems.length === 0,
    outOfStockItems,
  };
}

/**
 * Helper to reset in-memory database during tests
 */
export function _resetServerCartsDbForTests(initialCarts: CartRecord[] = []) {
  SERVER_CARTS_DB = [...initialCarts];
}
