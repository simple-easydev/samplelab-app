import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const supabase = createSupabaseClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: window.localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

export function createClient() {
  return supabase;
}
