import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sanitizeString } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import {
  findCustomer,
  getCartById,
  updateCartStatus,
  generateSecureCheckoutUrl,
  validateCartStock,
} from '@/lib/cartService';
import { calculateMaxDiscount } from '@/lib/discountRules';
import { sendCheckoutLinkMessage, validateCheckoutUrl } from '@/lib/messagingService';
import { logVapiToolCall } from '@/lib/vapiAudit';

interface ParsedToolCall {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
}

/**
 * Validates the Vapi server-to-server authentication secret
 */
function isVapiAuthorized(request: Request): boolean {
  const configuredSecret = process.env.VAPI_SECRET_KEY || process.env.VAPI_WEBHOOK_SECRET;

  // If no secret is configured in local development, allow requests but warn
  if (!configuredSecret) {
    return true;
  }

  // 1. Check Authorization: Bearer <secret>
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (
      token.length === configuredSecret.length &&
      crypto.timingSafeEqual(Buffer.from(token), Buffer.from(configuredSecret))
    ) {
      return true;
    }
  }

  // 2. Check x-vapi-secret header
  const customHeader = request.headers.get('x-vapi-secret') || '';
  if (
    customHeader &&
    customHeader.length === configuredSecret.length &&
    crypto.timingSafeEqual(Buffer.from(customHeader), Buffer.from(configuredSecret))
  ) {
    return true;
  }

  return false;
}

/**
 * Parses tool calls from standard Vapi payloads or direct testing JSON
 */
function extractToolCalls(body: any): ParsedToolCall[] {
  const calls: ParsedToolCall[] = [];

  // 1. Standard Vapi message.toolCalls format
  if (body?.message?.type === 'tool-calls' && Array.isArray(body?.message?.toolCalls)) {
    for (const tc of body.message.toolCalls) {
      const id = tc.id || `call_${Date.now()}`;
      const name = tc.function?.name || tc.name || '';
      let args = tc.function?.arguments || tc.arguments || {};
      if (typeof args === 'string') {
        try {
          args = JSON.parse(args);
        } catch {
          args = {};
        }
      }
      calls.push({ toolCallId: id, toolName: name, args });
    }
    return calls;
  }

  // 2. Vapi toolCallList format
  if (Array.isArray(body?.message?.toolCallList)) {
    for (const tc of body.message.toolCallList) {
      const id = tc.id || `call_${Date.now()}`;
      const name = tc.function?.name || tc.name || '';
      let args = tc.function?.arguments || tc.arguments || {};
      if (typeof args === 'string') {
        try {
          args = JSON.parse(args);
        } catch {
          args = {};
        }
      }
      calls.push({ toolCallId: id, toolName: name, args });
    }
    return calls;
  }

  // 3. Vapi function-call webhook format
  if (body?.message?.type === 'function-call' && body?.message?.functionCall) {
    const fc = body.message.functionCall;
    const id = body.message.call?.id || `call_${Date.now()}`;
    const name = fc.name || '';
    let args = fc.parameters || fc.arguments || {};
    if (typeof args === 'string') {
      try {
        args = JSON.parse(args);
      } catch {
        args = {};
      }
    }
    calls.push({ toolCallId: id, toolName: name, args });
    return calls;
  }

  // 4. Direct tool call payload: { toolCallId, name, arguments }
  if (body?.name || body?.function || body?.tool) {
    const id = body.toolCallId || body.id || `call_${Date.now()}`;
    const name = body.name || body.function || body.tool;
    let args = body.arguments || body.parameters || body;
    if (typeof args === 'string') {
      try {
        args = JSON.parse(args);
      } catch {
        args = {};
      }
    }
    calls.push({ toolCallId: id, toolName: name, args });
    return calls;
  }

  return calls;
}

/**
 * Handles individual tool execution
 */
async function executeTool(
  toolName: string,
  args: Record<string, any>,
  toolCallId: string,
  ip: string
): Promise<{ result: Record<string, any>; status: number }> {
  // Validate customerId and cartId inputs
  const customerId = sanitizeString(args.customerId || args.customer_id || '', 100);
  const cartId = sanitizeString(args.cartId || args.cart_id || '', 100);

  // -------------------------------------------------------------
  // TOOL 1: get_max_discount
  // -------------------------------------------------------------
  if (toolName === 'get_max_discount') {
    if (!customerId) {
      const err = {
        success: false,
        code: 'MISSING_CUSTOMER_ID',
        message: 'customerId argument is required.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    if (!cartId) {
      const err = {
        success: false,
        code: 'MISSING_CART_ID',
        message: 'cartId argument is required.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    // Verify customer exists
    const customer = await findCustomer(customerId);
    if (!customer) {
      const err = {
        success: false,
        code: 'CUSTOMER_NOT_FOUND',
        message: 'Customer was not found.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 404 };
    }

    // Verify cart exists
    const cart = await getCartById(cartId);
    if (!cart) {
      const err = {
        success: false,
        code: 'CART_NOT_FOUND',
        message: 'Cart was not found.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 404 };
    }

    // Verify ownership
    const isOwner =
      cart.customerId.toLowerCase() === customer.id.toLowerCase() ||
      cart.customerEmail.toLowerCase() === customer.email.toLowerCase();

    if (!isOwner) {
      const err = {
        success: false,
        code: 'CART_ACCESS_DENIED',
        message: 'Cart does not belong to the specified customer.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 403 };
    }

    // Calculate maximum safe discount based on business rules
    const discountCalc = calculateMaxDiscount(cart);

    // If discount was allowed, update cart status and record offered discount
    if (discountCalc.allowed && discountCalc.maxDiscountPercent > 0) {
      await updateCartStatus(cart.id, 'coupon_offered', {
        offeredDiscountPercent: discountCalc.maxDiscountPercent,
      });
    }

    await logVapiToolCall({
      toolName,
      toolCallId,
      customerId,
      cartId,
      success: true,
      result: discountCalc,
      ipAddress: ip,
    });

    return { result: discountCalc, status: 200 };
  }

  // -------------------------------------------------------------
  // TOOL 2: get_checkout_link
  // -------------------------------------------------------------
  if (toolName === 'get_checkout_link') {
    if (!customerId) {
      const err = {
        success: false,
        code: 'MISSING_CUSTOMER_ID',
        message: 'customerId argument is required.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    if (!cartId) {
      const err = {
        success: false,
        code: 'MISSING_CART_ID',
        message: 'cartId argument is required.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    // Verify customer
    const customer = await findCustomer(customerId);
    if (!customer) {
      const err = {
        success: false,
        code: 'CUSTOMER_NOT_FOUND',
        message: 'Customer was not found.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 404 };
    }

    // Verify cart
    const cart = await getCartById(cartId);
    if (!cart) {
      const err = {
        success: false,
        code: 'CART_NOT_FOUND',
        message: 'Cart was not found.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 404 };
    }

    // Verify ownership
    const isOwner =
      cart.customerId.toLowerCase() === customer.id.toLowerCase() ||
      cart.customerEmail.toLowerCase() === customer.email.toLowerCase();

    if (!isOwner) {
      const err = {
        success: false,
        code: 'CART_ACCESS_DENIED',
        message: 'Cart does not belong to the specified customer.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 403 };
    }

    // Check if cart has already been converted
    if (cart.status === 'converted') {
      const err = {
        success: false,
        code: 'CART_ALREADY_CONVERTED',
        message: 'This cart has already been completed.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    // Check product stock availability
    const stockCheck = await validateCartStock(cart);
    if (!stockCheck.valid) {
      const err = {
        success: false,
        code: 'PRODUCTS_OUT_OF_STOCK',
        message: `Items no longer in stock: ${stockCheck.outOfStockItems.join(', ')}`,
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 409 };
    }

    // Generate secure real checkout link
    const checkoutUrl = generateSecureCheckoutUrl(cart);

    // Update status to 'contacted'
    await updateCartStatus(cart.id, 'contacted', { checkoutUrl });

    const result = {
      success: true,
      checkoutUrl,
    };

    await logVapiToolCall({
      toolName,
      toolCallId,
      customerId,
      cartId,
      success: true,
      result,
      ipAddress: ip,
    });

    return { result, status: 200 };
  }

  // -------------------------------------------------------------
  // TOOL 3: send_checkout_link
  // -------------------------------------------------------------
  if (toolName === 'send_checkout_link') {
    const rawCheckoutUrl = args.checkoutUrl || args.checkout_url || '';
    const checkoutUrl = sanitizeString(rawCheckoutUrl, 500);

    if (!customerId) {
      const err = {
        success: false,
        code: 'MISSING_CUSTOMER_ID',
        message: 'customerId argument is required.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    if (!cartId) {
      const err = {
        success: false,
        code: 'MISSING_CART_ID',
        message: 'cartId argument is required.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    if (!checkoutUrl) {
      const err = {
        success: false,
        code: 'MISSING_CHECKOUT_URL',
        message: 'checkoutUrl argument is required.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    // Validate checkout URL domain
    if (!validateCheckoutUrl(checkoutUrl)) {
      const err = {
        success: false,
        code: 'INVALID_CHECKOUT_URL',
        message: 'Checkout URL must point to Bhai Jeweller official checkout.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 400 };
    }

    // Verify customer
    const customer = await findCustomer(customerId);
    if (!customer) {
      const err = {
        success: false,
        code: 'CUSTOMER_NOT_FOUND',
        message: 'Customer was not found.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 404 };
    }

    // Verify cart
    const cart = await getCartById(cartId);
    if (!cart) {
      const err = {
        success: false,
        code: 'CART_NOT_FOUND',
        message: 'Cart was not found.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 404 };
    }

    // Verify ownership
    const isOwner =
      cart.customerId.toLowerCase() === customer.id.toLowerCase() ||
      cart.customerEmail.toLowerCase() === customer.email.toLowerCase();

    if (!isOwner) {
      const err = {
        success: false,
        code: 'CART_ACCESS_DENIED',
        message: 'Cart does not belong to the specified customer.',
      };
      await logVapiToolCall({
        toolName,
        toolCallId,
        customerId,
        cartId,
        success: false,
        error: err.message,
        ipAddress: ip,
      });
      return { result: err, status: 403 };
    }

    // Dispatch message using messaging service abstraction
    const sendResult = await sendCheckoutLinkMessage({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone || cart.customerPhone,
      customerEmail: customer.email || cart.customerEmail,
      cartId: cart.id,
      checkoutUrl,
    });

    if (sendResult.success) {
      await updateCartStatus(cart.id, 'checkout_sent', { checkoutUrl });
    }

    await logVapiToolCall({
      toolName,
      toolCallId,
      customerId,
      cartId,
      success: sendResult.success,
      result: sendResult,
      error: sendResult.success ? null : sendResult.message,
      ipAddress: ip,
    });

    return {
      result: sendResult,
      status: sendResult.success ? 200 : sendResult.code === 'MESSAGING_NOT_CONFIGURED' ? 200 : 400,
    };
  }

  // -------------------------------------------------------------
  // UNSUPPORTED TOOL
  // -------------------------------------------------------------
  const unsupported = {
    success: false,
    code: 'UNSUPPORTED_TOOL',
    message: `The tool '${toolName}' is not recognized. Expected one of: get_max_discount, get_checkout_link, send_checkout_link.`,
  };

  await logVapiToolCall({
    toolName: toolName || 'unknown',
    toolCallId,
    customerId,
    cartId,
    success: false,
    error: unsupported.message,
    ipAddress: ip,
  });

  return { result: unsupported, status: 400 };
}

/**
 * Main Vapi Tools POST handler
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Rate limiting: 60 requests per minute per IP
  const rateLimit = checkRateLimit(`vapi_tools_${ip}`, 60, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests. Please wait ${rateLimit.resetSeconds} seconds.`,
      },
      { status: 429 }
    );
  }

  // 2. Authentication check
  if (!isVapiAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized Vapi request.',
      },
      { status: 401 }
    );
  }

  // 3. Parse JSON Body
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload.',
      },
      { status: 400 }
    );
  }

  // 4. Extract tool calls
  const toolCalls = extractToolCalls(body);

  if (toolCalls.length === 0) {
    return NextResponse.json(
      {
        success: false,
        code: 'INVALID_REQUEST',
        message: 'No valid tool call or function invocation found in payload.',
      },
      { status: 400 }
    );
  }

  // 5. Execute tool calls and collect results
  const results: Array<{ toolCallId: string; result: any }> = [];
  let primaryResult: any = null;
  let highestStatus = 200;

  for (const call of toolCalls) {
    const { result, status } = await executeTool(
      call.toolName,
      call.args,
      call.toolCallId,
      ip
    );

    if (status > highestStatus) {
      highestStatus = status;
    }

    if (!primaryResult) {
      primaryResult = result;
    }

    results.push({
      toolCallId: call.toolCallId,
      result,
    });
  }

  // Return standard Vapi custom tool response format
  // Compatible with both Vapi's webhook runner and direct JSON invocation
  return NextResponse.json(
    {
      results,
      // Top-level properties for direct/convenient testing
      toolCallId: toolCalls[0]?.toolCallId,
      ...primaryResult,
    },
    { status: 200 }
  );
}
