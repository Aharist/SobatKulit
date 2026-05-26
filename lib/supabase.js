import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client (for public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side helper — creates a Supabase client
// All queries MUST filter by userId from Clerk auth()
export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
