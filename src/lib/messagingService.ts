import { SITE_URL } from './constants';

export interface SendCheckoutLinkParams {
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  cartId: string;
  checkoutUrl: string;
}

export type MessagingChannel = 'whatsapp' | 'sms' | 'email';

export interface MessagingResult {
  success: boolean;
  channel?: MessagingChannel;
  message: string;
  code?: string;
}

/**
 * Validates that the checkout URL is legitimate and belongs to the Bhai Jeweller domain
 */
export function validateCheckoutUrl(checkoutUrl: string): boolean {
  if (!checkoutUrl || typeof checkoutUrl !== 'string') return false;

  try {
    // Relative URL check
    if (checkoutUrl.startsWith('/checkout')) return true;

    const parsed = new URL(checkoutUrl);
    const allowedHosts = [
      'bhai-woad.vercel.app',
      'bhaijeweller.co.uk',
      'localhost',
      '127.0.0.1',
    ];

    if (process.env.NEXT_PUBLIC_SITE_URL) {
      try {
        allowedHosts.push(new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname);
      } catch {}
    }

    if (SITE_URL) {
      try {
        allowedHosts.push(new URL(SITE_URL).hostname);
      } catch {}
    }

    return (
      allowedHosts.includes(parsed.hostname) &&
      parsed.pathname.startsWith('/checkout')
    );
  } catch {
    return false;
  }
}

/**
 * Checks if a real messaging provider is configured in environment variables
 */
export function getActiveMessagingProvider(): {
  provider: 'meta_whatsapp' | 'twilio_whatsapp' | 'twilio_sms' | 'resend_email' | null;
  channel: MessagingChannel | null;
} {
  // 1. Meta WhatsApp Cloud API
  if (
    process.env.WHATSAPP_ACCESS_TOKEN &&
    process.env.WHATSAPP_PHONE_NUMBER_ID
  ) {
    return { provider: 'meta_whatsapp', channel: 'whatsapp' };
  }

  // 2. Twilio WhatsApp
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER
  ) {
    return { provider: 'twilio_whatsapp', channel: 'whatsapp' };
  }

  // 3. Twilio SMS
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    return { provider: 'twilio_sms', channel: 'sms' };
  }

  // 4. Resend Email
  if (process.env.RESEND_API_KEY) {
    return { provider: 'resend_email', channel: 'email' };
  }

  return { provider: null, channel: null };
}

/**
 * Sends the recovered checkout link to the customer via the configured messaging provider.
 * Strictly avoids fake sending if credentials are not configured.
 */
export async function sendCheckoutLinkMessage(
  params: SendCheckoutLinkParams
): Promise<MessagingResult> {
  const { customerName, customerPhone, customerEmail, checkoutUrl } = params;

  // 1. Validate checkout URL
  if (!validateCheckoutUrl(checkoutUrl)) {
    return {
      success: false,
      code: 'INVALID_CHECKOUT_URL',
      message: 'The provided checkout URL is invalid or from an unauthorized domain.',
    };
  }

  // 2. Check provider configuration
  const { provider, channel } = getActiveMessagingProvider();

  if (!provider || !channel) {
    return {
      success: false,
      code: 'MESSAGING_NOT_CONFIGURED',
      message: 'No messaging provider is configured.',
    };
  }

  const recipientPhone = customerPhone ? customerPhone.replace(/[^\d+]/g, '') : '';
  const recipientName = customerName || 'Valued Client';
  const messageBody = `Hello ${recipientName}, here is your personal checkout link to complete your Bhai Jeweller order: ${checkoutUrl}\n\nThank you for choosing Bhai Jeweller.`;

  try {
    // 3. Execute actual provider dispatch
    if (provider === 'meta_whatsapp') {
      if (!recipientPhone) {
        return {
          success: false,
          code: 'MISSING_CUSTOMER_PHONE',
          message: 'Customer phone number is required for WhatsApp.',
        };
      }

      const res = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipientPhone,
            type: 'text',
            text: { body: messageBody },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return {
          success: false,
          code: 'PROVIDER_ERROR',
          message: err.error?.message || 'Meta WhatsApp dispatch failed.',
        };
      }

      return {
        success: true,
        channel: 'whatsapp',
        message: 'Checkout link sent successfully',
      };
    }

    if (provider === 'twilio_whatsapp' || provider === 'twilio_sms') {
      if (!recipientPhone) {
        return {
          success: false,
          code: 'MISSING_CUSTOMER_PHONE',
          message: 'Customer phone number is required for SMS/WhatsApp.',
        };
      }

      const isWhatsApp = provider === 'twilio_whatsapp';
      const fromNumber = isWhatsApp
        ? `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
        : process.env.TWILIO_PHONE_NUMBER;
      const toNumber = isWhatsApp ? `whatsapp:${recipientPhone}` : recipientPhone;

      const authHeader = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      const bodyData = new URLSearchParams({
        From: fromNumber!,
        To: toNumber,
        Body: messageBody,
      });

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: bodyData.toString(),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return {
          success: false,
          code: 'PROVIDER_ERROR',
          message: err.message || 'Twilio message dispatch failed.',
        };
      }

      return {
        success: true,
        channel: isWhatsApp ? 'whatsapp' : 'sms',
        message: 'Checkout link sent successfully',
      };
    }

    if (provider === 'resend_email') {
      if (!customerEmail) {
        return {
          success: false,
          code: 'MISSING_CUSTOMER_EMAIL',
          message: 'Customer email address is required for email sending.',
        };
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'orders@bhaijeweller.co.uk',
          to: customerEmail,
          subject: 'Your Bhai Jeweller Cart Checkout Link',
          html: `<p>Hello ${recipientName},</p><p>Thank you for shopping with Bhai Jeweller. Please click the link below to continue to checkout:</p><p><a href="${checkoutUrl}">Complete Your Order</a></p>`,
        }),
      });

      if (!res.ok) {
        return {
          success: false,
          code: 'PROVIDER_ERROR',
          message: 'Email sending failed via Resend.',
        };
      }

      return {
        success: true,
        channel: 'email',
        message: 'Checkout link sent successfully',
      };
    }

    return {
      success: false,
      code: 'MESSAGING_NOT_CONFIGURED',
      message: 'No messaging provider is configured.',
    };
  } catch (error: any) {
    return {
      success: false,
      code: 'PROVIDER_EXCEPTION',
      message: error.message || 'Messaging delivery encountered an unexpected error.',
    };
  }
}
