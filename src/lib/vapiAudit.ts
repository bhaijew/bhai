import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export interface VapiAuditLogEntry {
  id: string;
  toolName: string;
  customerId?: string;
  cartId?: string;
  toolCallId?: string;
  success: boolean;
  resultSummary?: Record<string, unknown>;
  errorMessage?: string;
  ipAddress?: string;
  createdAt: string;
}

// In-memory fallback audit store
let SERVER_VAPI_LOGS: VapiAuditLogEntry[] = [];

/**
 * Sanitizes an object to ensure sensitive credentials (passwords, tokens, secret keys)
 * are NEVER written to audit logs.
 */
function sanitizeForAudit(data: unknown): Record<string, unknown> | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const sanitized: Record<string, unknown> = {};
  const forbiddenKeys = [
    'password',
    'secret',
    'token',
    'key',
    'card',
    'cvv',
    'authorization',
    'cookie',
  ];

  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    const isSensitive = forbiddenKeys.some((f) => k.toLowerCase().includes(f));
    if (isSensitive) {
      sanitized[k] = '[REDACTED]';
    } else if (typeof v === 'object' && v !== null) {
      sanitized[k] = sanitizeForAudit(v);
    } else {
      sanitized[k] = v;
    }
  }

  return sanitized;
}

/**
 * Records a safe server-side audit log for Vapi tool interactions
 */
export async function logVapiToolCall(entry: {
  toolName: string;
  customerId?: string;
  cartId?: string;
  toolCallId?: string;
  success: boolean;
  result?: unknown;
  error?: string | null;
  ipAddress?: string;
}): Promise<void> {
  const logId = `vapi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const auditRecord: VapiAuditLogEntry = {
    id: logId,
    toolName: entry.toolName,
    customerId: entry.customerId,
    cartId: entry.cartId,
    toolCallId: entry.toolCallId,
    success: entry.success,
    resultSummary: sanitizeForAudit(entry.result),
    errorMessage: entry.error || undefined,
    ipAddress: entry.ipAddress || 'VAPI_AGENT',
    createdAt: now,
  };

  // Safe server-side console log
  console.log(`[VAPI AUDIT] ${now} | Tool: ${auditRecord.toolName} | Success: ${auditRecord.success} | Cart: ${auditRecord.cartId || 'N/A'} | Customer: ${auditRecord.customerId || 'N/A'}`);

  if (supabase) {
    try {
      await supabase.from('vapi_audit_logs').insert({
        id: auditRecord.id,
        tool_name: auditRecord.toolName,
        customer_id: auditRecord.customerId || null,
        cart_id: auditRecord.cartId || null,
        tool_call_id: auditRecord.toolCallId || null,
        success: auditRecord.success,
        result_summary: auditRecord.resultSummary || null,
        error_message: auditRecord.errorMessage || null,
        ip_address: auditRecord.ipAddress || null,
        created_at: auditRecord.createdAt,
      });
    } catch (e) {
      console.error('Supabase vapi_audit_logs insert error:', e);
    }
  }

  SERVER_VAPI_LOGS.unshift(auditRecord);
  if (SERVER_VAPI_LOGS.length > 500) {
    SERVER_VAPI_LOGS.pop();
  }
}

/**
 * Retrieves recent audit logs (for admin review or testing)
 */
export async function getVapiAuditLogs(limit = 50): Promise<VapiAuditLogEntry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vapi_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          toolName: d.tool_name,
          customerId: d.customer_id || undefined,
          cartId: d.cart_id || undefined,
          toolCallId: d.tool_call_id || undefined,
          success: d.success,
          resultSummary: d.result_summary || undefined,
          errorMessage: d.error_message || undefined,
          ipAddress: d.ip_address || undefined,
          createdAt: d.created_at,
        }));
      }
    } catch {}
  }

  return SERVER_VAPI_LOGS.slice(0, limit);
}
