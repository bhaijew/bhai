import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pqphajebxltmzzypjjct.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcGhhamVieGx0bXp6eXBqamN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzODY1MDUsImV4cCI6MjEwNTk2MjUwNX0.QSNk4xzq6CdKGTysgl5NMEwHTQGxD6K3mbp4PnpPaR0';

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = !!supabaseInstance;
