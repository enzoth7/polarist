import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pkg;

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  const sql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'migrations', '20260323_create_avatars_bucket.sql'), 'utf-8');
  await client.query(sql);
  console.log('Avatars Migration executed successfully.');
  await client.end();
}
run().catch(console.error);
