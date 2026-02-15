/**
 * Supabase Direct SQL Query Tool
 * 
 * Usage:
 *   node scripts/supabase_query.mjs "SELECT * FROM profiles LIMIT 5"
 *   node scripts/supabase_query.mjs --tables    (list all tables)
 *   node scripts/supabase_query.mjs --describe profiles  (show columns)
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency needed)
function loadEnv() {
    try {
        const envPath = resolve(__dirname, '..', '.env');
        const content = readFileSync(envPath, 'utf-8');
        const vars = {};
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;
            const key = trimmed.slice(0, eqIdx).trim();
            const value = trimmed.slice(eqIdx + 1).trim();
            vars[key] = value;
        }
        return vars;
    } catch (e) {
        console.error('Error reading .env:', e.message);
        process.exit(1);
    }
}

const env = loadEnv();
const DATABASE_URL = env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
}

// Parse connection manually to avoid URL encoding issues with special chars in password
const config = {
    host: 'db.epoolgyzovefaofyvocz.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: env.DATABASE_URL.split(':')[2].split('@')[0], // Extract password from URL
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
};

async function run() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node scripts/supabase_query.mjs "SELECT * FROM profiles"');
        console.log('  node scripts/supabase_query.mjs --tables');
        console.log('  node scripts/supabase_query.mjs --describe <table_name>');
        process.exit(0);
    }

    const client = new pg.Client(config);

    try {
        await client.connect();
        console.log('✅ Connected to Supabase PostgreSQL\n');

        let sql;

        if (args[0] === '--tables') {
            sql = `SELECT table_name FROM information_schema.tables 
             WHERE table_schema = 'public' 
             ORDER BY table_name;`;
        } else if (args[0] === '--describe') {
            const table = args[1];
            if (!table) {
                console.error('Specify a table: --describe profiles');
                process.exit(1);
            }
            sql = `SELECT column_name, data_type, is_nullable, column_default 
             FROM information_schema.columns 
             WHERE table_schema = 'public' AND table_name = '${table}' 
             ORDER BY ordinal_position;`;
        } else if (args[0] === '--file') {
            const filePath = args[1];
            if (!filePath) {
                console.error('Specify a file: --file <path_to_sql_file>');
                process.exit(1);
            }
            try {
                sql = readFileSync(filePath, 'utf-8');
            } catch (e) {
                console.error('Error reading SQL file:', e.message);
                process.exit(1);
            }
        } else {
            sql = args.join(' ');
        }

        console.log(`📝 SQL: ${sql}\n`);
        const result = await client.query(sql);

        const results = Array.isArray(result) ? result : [result];

        results.forEach((res, index) => {
            if (results.length > 1) console.log(`\n--- Result ${index + 1} ---`);
            if (res.rows.length === 0) {
                console.log('(No rows returned)');
            } else {
                console.table(res.rows);
                console.log(`\n${res.rows.length} row(s) returned.`);
            }
        });

    } catch (err) {
        console.error('❌ Query error:', err.message);
    } finally {
        await client.end();
    }
}

run();
