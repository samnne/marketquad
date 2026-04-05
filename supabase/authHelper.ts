import 'expo-sqlite/localStorage/install';

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_RN_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_RN_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl!, supabasePublishableKey!, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
