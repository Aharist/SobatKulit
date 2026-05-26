import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client (uses anon key — safe for browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client — uses service_role key for admin operations.
// This key MUST NEVER be exposed to the client (no NEXT_PUBLIC_ prefix).
// All queries MUST still filter by userId from Clerk auth() for defense-in-depth.
export function createServerSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    // Fallback to anon key if service role is not configured
    console.warn('[Supabase] SUPABASE_SERVICE_ROLE_KEY not set, falling back to anon key');
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
