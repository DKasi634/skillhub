import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce", // Use PKCE for SPAs
      detectSessionInUrl: true, // Detect session from URL after redirect
      persistSession:true
    },
  });