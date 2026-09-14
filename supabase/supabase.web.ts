import { createClient } from '@supabase/supabase-js'; // Or '@supabase/supabase-js' depending on your exact package

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// Safe storage wrapper to prevent Node.js environment from crashing during Expo export
const safeLocalStorage = {
  getItem: (key: string) => {
    if (!isBrowser) return null;
    return window.localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (!isBrowser) return;
    window.localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeLocalStorage,
    autoRefreshToken: isBrowser,
    persistSession: isBrowser,
  },
});
