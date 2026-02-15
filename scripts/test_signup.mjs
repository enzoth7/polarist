import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
    const content = readFileSync(resolve(__dirname, '..', '.env'), 'utf-8');
    const vars = {};
    for (const line of content.split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const eq = t.indexOf('=');
        if (eq === -1) continue;
        vars[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
    }
    return vars;
}

const env = loadEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testSignup() {
    const testEmail = `testbrand${Date.now()}@gmail.com`;
    const testPassword = 'TestPass123!';
    const testName = 'Test Brand';

    console.log(`Testing signup with: ${testEmail}`);

    const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
            data: {
                business_name: testName,
            },
        },
    });

    if (error) {
        console.error('❌ SIGNUP ERROR:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ SIGNUP SUCCESS');
        console.log('User ID:', data.user?.id);
        console.log('Email:', data.user?.email);

        // Check if profile was created
        if (data.user) {
            const { data: profile, error: profileErr } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileErr) {
                console.error('❌ PROFILE FETCH ERROR:', JSON.stringify(profileErr, null, 2));
            } else {
                console.log('✅ Profile created:', JSON.stringify(profile, null, 2));
            }
        }
    }
}

testSignup();
