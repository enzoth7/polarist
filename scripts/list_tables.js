
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function listAllTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Check all public tables
    const res = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Public tables in Supabase:');
    res.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

  } catch (err) {
    console.error('Error listing tables:', err.message);
  } finally {
    await client.end();
  }
}

listAllTables();
