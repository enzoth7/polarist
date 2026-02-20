import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_schema():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("❌ DATABASE_URL missing")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        print("📡 Fetching schema for 'profiles' table...")
        cur.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles'
            ORDER BY ordinal_position;
        """)
        rows = cur.fetchall()
        for row in rows:
            print(f"- {row[0]}: {row[1]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    get_schema()
