import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def migrate_schema():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("❌ DATABASE_URL missing")
        return

    # Mapeo de IDs de preguntas a nombres de columnas
    # 1: BRAND_CATEGORY -> business_category (ya existe)
    # 2: BRAND_HISTORY -> brand_history
    # 3: BRAND_HISTORY_EXTRA -> brand_history_extra (no está en QUESTION_IDS pero podría ser útil si se añade)
    # 4: DIFFERENTIAL -> brand_differential
    # 5: CLIENT_IDEAL -> target_audience (ya existe)
    # 6: CLIENT_IDEAL_EXTRA -> target_audience_extra
    # 7: PROMOTIONS -> promotions
    # 8: PROMOTIONS_EXTRA -> promotions_extra
    # 9: PRODUCTS -> products_to_highlight
    # 10: OPERATION -> operation_type
    # 11: SHIPPING -> shipping_scope
    # 12: CONTENT_TYPE -> content_type_preferred 
    # 13: RESOURCES -> content_resources
    # 14: CAMERA -> camera_quality
    # 15: SALES_CHANNELS -> sales_channels
    # 16: PRIORITY_CHANNEL -> priority_sales_channel
    # 17: TYPOGRAPHY -> typography_status
    # 18: SOCIAL_PRIORITY -> social_priority_goal
    # 19: HUMANIZATION -> humanization_level
    # 20: PRODUCT_LOOK -> product_visual_style
    # 21: FREQUENCY -> posting_frequency
    # 22: BRAND_FEELING -> brand_feeling
    # 23: COLOR_PALETTE_DEFINED -> color_palette_status
    # 24: BRAND_COLORS -> brand_colors_extra
    # 25: BRAND_PERCEPTION -> brand_perception
    
    new_columns = [
        ("brand_history", "TEXT"),
        ("brand_differential", "TEXT"),
        ("target_audience_extra", "TEXT"),
        ("promotions", "TEXT"),
        ("promotions_extra", "TEXT"),
        ("products_to_highlight", "TEXT"),
        ("operation_type", "TEXT"),
        ("shipping_scope", "TEXT"),
        ("content_type_preferred", "TEXT"),
        ("content_resources", "TEXT"),
        ("camera_quality", "TEXT"),
        ("sales_channels", "TEXT"),
        ("priority_sales_channel", "TEXT"),
        ("typography_status", "TEXT"),
        ("social_priority_goal", "TEXT"),
        ("humanization_level", "TEXT"),
        ("product_visual_style", "TEXT"),
        ("posting_frequency", "TEXT"),
        ("brand_feeling", "TEXT"),
        ("color_palette_status", "TEXT"),
        ("brand_colors_extra", "TEXT"),
        ("brand_perception", "TEXT")
    ]

    legacy_columns = [
        "goal", "personality", "colors", "visual_style", "lighting", 
        "image_focus", "tone_of_voice", "content_type", "wow_factor", 
        "brand_questionnaire", "missions_count", "subscription_ends_at",
        "plan_type", "avatar_url", "website", "subscription_tier",
        "subscription_status", "stripe_customer_id", "full_name"
    ]

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        print("📡 Iniciando migración de esquema...")

        # 1. Agregar nuevas columnas de forma segura
        for col_name, col_type in new_columns:
            cur.execute(f"""
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                   WHERE table_name = 'profiles' AND column_name = '{col_name}') THEN
                        ALTER TABLE public.profiles ADD COLUMN {col_name} {col_type};
                    END IF;
                END $$;
            """)
        print("✅ Nuevas columnas agregadas.")

        # 2. Eliminar columnas obsoletas
        for col_name in legacy_columns:
            cur.execute(f"ALTER TABLE public.profiles DROP COLUMN IF EXISTS {col_name};")
        print("✅ Columnas obsoletas eliminadas.")

        conn.commit()
        print("🚀 Migración completada exitosamente.")
        cur.close()
        conn.close()
    except Exception as e:
        if conn: conn.rollback()
        print(f"❌ Error durante la migración: {e}")

if __name__ == "__main__":
    migrate_schema()
