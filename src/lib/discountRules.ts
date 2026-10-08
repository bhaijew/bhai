import { CartRecord } from './cartService';

export interface DiscountCalculationResult {
  success: boolean;
  customerId: string;
  cartId: string;
  cartTotal: number;
  currency: string;
  maxDiscountPercent: number;
  discountAmount?: number;
  finalTotal?: number;
  allowed: boolean;
  reason?: string;
}

// Configurable business thresholds
const DEFAULT_MAX_DISCOUNT_PERCENT = 10;
const ABSOLUTE_SAFE_CAP_PERCENT = 15;
const DEFAULT_MIN_CART_VALUE = 50.0; // £50 minimum order for discount

/**
 * Calculates the maximum discount safely allowable for an abandoned cart
 * Strictly enforces business margin rules and prevents arbitrary discount injection.
 */
export function calculateMaxDiscount(cart: CartRecord): DiscountCalculationResult {
  const configuredMax = Math.min(
    ABSOLUTE_SAFE_CAP_PERCENT,
    Math.max(
      0,
      Number(process.env.MAX_DISCOUNT_PERCENT || DEFAULT_MAX_DISCOUNT_PERCENT)
    )
  );

  const minCartValue = Math.max(
    0,
    Number(process.env.MIN_CART_VALUE_FOR_DISCOUNT || DEFAULT_MIN_CART_VALUE)
  );

  const cartTotal = Number(cart.subtotal.toFixed(2));
  const currency = cart.currency || 'GBP';

  // 1. If cart is empty or total is zero or negative -> No discount
  if (cartTotal <= 0 || !cart.items || cart.items.length === 0) {
    return {
      success: true,
      customerId: cart.customerId,
      cartId: cart.id,
      cartTotal: 0,
      currency,
      allowed: false,
      maxDiscountPercent: 0,
      reason: 'Cart is empty',
    };
  }

  // 2. If cart is already converted or customer opted out -> No discount
  if (cart.status === 'converted' || cart.status === 'opted_out') {
    return {
      success: true,
      customerId: cart.customerId,
      cartId: cart.id,
      cartTotal,
      currency,
      allowed: false,
      maxDiscountPercent: 0,
      reason: 'Order already finalized or opted out',
    };
  }

  // 3. Minimum cart value check
  if (cartTotal < minCartValue) {
    return {
      success: true,
      customerId: cart.customerId,
      cartId: cart.id,
      cartTotal,
      currency,
      allowed: false,
      maxDiscountPercent: 0,
      reason: `Order value below threshold of £${minCartValue}`,
    };
  }

  // 4. Calculate safe discount tier
  // If the cart already has an active offered discount recorded from a previous recovery step, preserve it:
  let allowedPercent = cart.offeredDiscountPercent > 0
    ? Math.min(cart.offeredDiscountPercent, configuredMax)
    : DEFAULT_MAX_DISCOUNT_PERCENT;

  // For premium orders above £500, if configured higher, allow up to configuredMax
  if (cartTotal >= 500 && configuredMax > DEFAULT_MAX_DISCOUNT_PERCENT) {
    allowedPercent = configuredMax;
  }

  // Bound within [0, ABSOLUTE_SAFE_CAP_PERCENT]
  allowedPercent = Math.min(ABSOLUTE_SAFE_CAP_PERCENT, Math.max(0, allowedPercent));

  if (allowedPercent <= 0) {
    return {
      success: true,
      customerId: cart.customerId,
      cartId: cart.id,
      cartTotal,
      currency,
      allowed: false,
      maxDiscountPercent: 0,
    };
  }

  const discountAmount = Number(((cartTotal * allowedPercent) / 100).toFixed(2));
  const finalTotal = Number((cartTotal - discountAmount).toFixed(2));

  return {
    success: true,
    customerId: cart.customerId,
    cartId: cart.id,
    cartTotal,
    currency,
    maxDiscountPercent: allowedPercent,
    discountAmount,
    finalTotal,
    allowed: true,
  };
}
