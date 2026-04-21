import pg from 'pg';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde el CWD actual
dotenv.config({ path: resolve(process.cwd(), '.env') });

const { Client } = pg;

async function execute() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ ERROR: No se encontró DATABASE_URL en las variables de entorno.");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Conectado a la base de datos Supabase exitosamente.");

    // Query para crear la tabla usuarios
    const query = `
      CREATE TABLE IF NOT EXISTS polarist_usuarios (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        nombre VARCHAR(255),
        rubro VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await client.query(query);
    console.log("✅ Éxito: La tabla 'polarist_usuarios' ha sido creada correctamente en Supabase.");

  } catch (error) {
    console.error("❌ ERROR al ejecutar SQL:", error.message);
  } finally {
    await client.end();
  }
}

execute();
