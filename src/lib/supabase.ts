import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('Please configure in Vercel:');
    console.error('- VITE_SUPABASE_URL');
    console.error('- VITE_SUPABASE_ANON_KEY');

    // Create a dummy client to prevent crashes, but log warnings
    const dummyUrl = 'https://placeholder.supabase.co';
    const dummyKey = 'placeholder-key';

    console.warn('⚠️ Using placeholder Supabase client - features will not work!');
    supabaseClient = createClient(dummyUrl, dummyKey);
} else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
            storage: window.localStorage
        }
    });
    console.log('✅ Supabase client initialized successfully');
}

export const supabase = supabaseClient;
