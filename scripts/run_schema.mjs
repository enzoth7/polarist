import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use service role key for admin operations
const supabaseUrl = 'https://epoolgyzovefaofyvocz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    // Read from .env manually
    const envContent = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
    const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
    if (!match) {
        console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env');
        process.exit(1);
    }
    var serviceKey = match[1].trim();
} else {
    var serviceKey = supabaseServiceKey;
}

const supabase = createClient(supabaseUrl, serviceKey);

// Read SQL file
const sqlFile = join(__dirname, '..', 'supabase_auth_schema.sql');
const sql = readFileSync(sqlFile, 'utf-8');

console.log('🚀 Executing auth schema on Supabase...\n');

// Execute SQL via rpc
const { data, error } = await supabase.rpc('exec_sql', { query: sql }).maybeSingle();

if (error) {
    // rpc may not exist, try raw REST API instead
    console.log('⚠️  rpc not available, using REST API...\n');

    // Split SQL into individual statements and execute via postgrest
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
        console.log('⚠️  REST API also unavailable. Using Supabase Management API...\n');

        // Use the Supabase SQL endpoint (Management API)
        const sqlResponse = await fetch(`${supabaseUrl}/pg/query`, {
            method: 'POST',
            headers: {
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: sql }),
        });

        if (!sqlResponse.ok) {
            const errText = await sqlResponse.text();
            console.error('❌ Failed:', errText);
            console.log('\n📋 Please execute the SQL manually in Supabase Dashboard:');
            console.log('   https://supabase.com/dashboard/project/epoolgyzovefaofyvocz/sql/new');
        } else {
            const result = await sqlResponse.json();
            console.log('✅ Schema executed successfully!');
            console.log(result);
        }
    } else {
        const result = await response.json();
        console.log('✅ Schema executed successfully!');
        console.log(result);
    }
} else {
    console.log('✅ Schema executed successfully!');
    console.log(data);
}
