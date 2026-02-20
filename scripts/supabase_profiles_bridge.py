import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import json

# Cargar variables de entorno
load_dotenv()

def get_db_connection():
    # Usamos DATABASE_URL que es la conexión directa a PostgreSQL
    db_url = os.environ.get("DATABASE_URL")
    
    if not db_url:
        raise ValueError("❌ Falta DATABASE_URL en .env")
        
    return psycopg2.connect(db_url)

def fetch_profiles(limit: int = 5):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        print(f"📡 Conectado directamente a PostgreSQL (Modo Lectura)")
        cur.execute("SELECT * FROM profiles ORDER BY updated_at DESC LIMIT %s;", (limit,))
        rows = cur.fetchall()
        if rows:
            print(f"✅ Se encontraron {len(rows)} perfiles.")
            print(json.dumps(rows, indent=2, ensure_ascii=False, default=str))
        else:
            print("⚠️ No se encontraron datos en la tabla profiles.")
        cur.close()
    except Exception as e:
        print(f"❌ Error de lectura: {str(e)}")
    finally:
        if conn:
            conn.close()

def execute_mutation(query: str, params: tuple = None):
    """Ejecuta una mutación (INSERT, UPDATE, DELETE) con commit/rollback."""
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        print(f"📡 Ejecutando mutación en PostgreSQL...")
        cur.execute(query, params)
        conn.commit()
        print(f"✅ Operación completada exitosamente. Filas afectadas: {cur.rowcount}")
        cur.close()
        return True
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"❌ Error de mutación: {str(e)}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # Por defecto solo lee para seguridad
    fetch_profiles()
