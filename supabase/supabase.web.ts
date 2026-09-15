// supabase.web.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_RN_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_WEB_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl!, supabasePublishableKey!, {
  auth: {
    storage: localStorage, // the browser's real localStorage, no polyfill needed
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});