import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';

// Server-side admin operations prioritize SUPABASE_SERVICE_ROLE_KEY to safely bypass RLS
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const fallbackKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

const activeKey = serviceRoleKey || fallbackKey;

let adminClient: SupabaseClient | null = null;

if (supabaseUrl && activeKey && !supabaseUrl.includes('your-project')) {
  adminClient = createClient(supabaseUrl, activeKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = adminClient;
export const isServiceRoleConfigured = !!serviceRoleKey;
