import os
import psycopg2
from psycopg2.extras import RealDictCursor

# Connection string from Estado_del_Proyecto.md
DB_URL = "postgresql://postgres:Kaiserland1998*@db.epoolgyzovefaofyvocz.supabase.co:5432/postgres"

def get_profile():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Search for Tasty Pay
        cur.execute("SELECT * FROM profiles WHERE business_name ILIKE '%Tasty%' OR business_name ILIKE '%taco%' LIMIT 5;")
        rows = cur.fetchall()
        
        if not rows:
            print("No profile found for Tasty Pay")
            return

        for row in rows:
            print("--- Found Profile ---")
            for key, value in row.items():
                print(f"{key}: {value}")
            print("---------------------")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_profile()
