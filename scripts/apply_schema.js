import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project Ref and Password
const PROJECT_REF = 'epoolgyzovefaofyvocz';
const DB_PASSWORD = 'Kaiserland1998*';

// List of potential pooler hosts (starting with SA East 1 as user is in LatAm)
const POOLER_HOSTS = [
    'aws-0-sa-east-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com',
    'aws-0-eu-central-1.pooler.supabase.com'
];

async function tryConnect(host) {
    // Use port 6543 (Transaction pooler) which is IPv4 compatible
    const connectionString = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@${host}:6543/postgres`;

    console.log(`🔌 Trying to connect to ${host} (Port 6543)...`);

    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false // Allow self-signed certs (needed for Supavisor in some envs)
        }
    });

    try {
        await client.connect();
        console.log(`✅ Connected successfully to ${host}!`);
        return client;
    } catch (err) {
        // Only log essential error part to keep it clean
        console.log(`❌ Failed to connect to ${host}: ${err.message.split('\n')[0]}`);
        await client.end();
        return null;
    }
}

async function run() {
    let client = null;

    // Try each host
    for (const host of POOLER_HOSTS) {
        client = await tryConnect(host);
        if (client) break;
    }

    if (!client) {
        console.error('❌ Could not connect to any Supabase pooler.');
        process.exit(1);
    }

    try {
        const sqlPath = path.join(__dirname, '..', 'supabase_auth_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing auth schema...');

        // Execute SQL
        await client.query(sql);

        console.log('✅ Schema applied successfully!');
        console.log('   - Created public.profiles table');
        console.log('   - Enabled RLS');
        console.log('   - Added policies');
        console.log('   - Created triggers');

    } catch (err) {
        console.error('❌ Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

run();
