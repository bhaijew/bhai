import { NextResponse } from 'next/server';

/**
 * Enterprise Request Security & CSRF Origin Guard
 */

const DEFAULT_MAX_PAYLOAD_BYTES = 1024 * 1024; // 1MB payload limit

export interface SecurityGuardOptions {
  maxSizeBytes?: number;
  allowCrossSite?: boolean;
}

/**
 * Validates request payload size and origin to prevent DoS and CSRF attacks
 */
export function validateRequestSecurity(
  request: Request,
  options: SecurityGuardOptions = {}
): { valid: boolean; errorResponse?: NextResponse } {
  const maxBytes = options.maxSizeBytes || DEFAULT_MAX_PAYLOAD_BYTES;

  // 1. Payload Size Check (Prevent memory exhaustion / DoS)
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return {
      valid: false,
      errorResponse: NextResponse.json(
        { success: false, error: 'Payload too large. Maximum allowed size is 1MB.' },
        { status: 413 }
      ),
    };
  }

  // 2. CSRF / Origin Validation for State-Changing Requests (POST, PUT, DELETE, PATCH)
  const method = request.method.toUpperCase();
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

  if (isMutation && !options.allowCrossSite) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    // If an Origin or Referer header is present, verify it matches our host or site URL
    const incomingDomain = origin || referer;
    if (incomingDomain && host) {
      try {
        const parsedIncoming = new URL(incomingDomain);
        const incomingHost = parsedIncoming.host;

        // Allow same host or localhost during development
        const isSameHost = incomingHost === host;
        const isLocalDev =
          incomingHost.startsWith('localhost') ||
          incomingHost.startsWith('127.0.0.1') ||
          host.startsWith('localhost') ||
          host.startsWith('127.0.0.1');

        // Check against NEXT_PUBLIC_SITE_URL if configured
        let isConfiguredSite = false;
        if (process.env.NEXT_PUBLIC_SITE_URL) {
          try {
            const configuredUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL);
            isConfiguredSite = incomingHost === configuredUrl.host;
          } catch {
            // Ignore malformed site URL
          }
        }

        if (!isSameHost && !isLocalDev && !isConfiguredSite) {
          return {
            valid: false,
            errorResponse: NextResponse.json(
              { success: false, error: 'Cross-origin request blocked: Unauthorized request origin.' },
              { status: 403 }
            ),
          };
        }
      } catch {
        // If URL parsing fails on incoming domain header, reject the suspicious request
        return {
          valid: false,
          errorResponse: NextResponse.json(
            { success: false, error: 'Malformed request headers detected.' },
            { status: 400 }
          ),
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Checks for honeypot bot trap values in submitted form bodies
 */
export function isBotSubmission(body: Record<string, any>): boolean {
  if (!body || typeof body !== 'object') return false;

  // Common honeypot field names hidden from real users
  const honeypotKeys = ['hp_check', 'website_url', 'bot_trap', 'fax_number', 'company_fax'];

  for (const key of honeypotKeys) {
    if (body[key] && typeof body[key] === 'string' && body[key].trim().length > 0) {
      return true;
    }
  }

  return false;
}
