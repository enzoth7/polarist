import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

bucket_name = "product-images"

# 1. New Orphan Files identified in the second audit
new_orphans = [
    "b10bb51b-5ab1-442a-bd6e-5b96299ecb24/0.4965072477622553.jpeg",
    "8fe7281f-a015-4de5-84c1-2329b7d95f83/0.3141400399542752.jpeg",
    "8fe7281f-a015-4de5-84c1-2329b7d95f83/0.7967113662787886.jpeg",
    "b10bb51b-5ab1-442a-bd6e-5b96299ecb24/DSC05952.jpg",
    "b10bb51b-5ab1-442a-bd6e-5b96299ecb24/0.12744684912798276.png",
    "b10bb51b-5ab1-442a-bd6e-5b96299ecb24/0.07005918633342512.jpeg",
    "b10bb51b-5ab1-442a-bd6e-5b96299ecb24/0.9789752582496704.png",
    "8fe7281f-a015-4de5-84c1-2329b7d95f83/0.4947186489872568.jpeg",
    "8fe7281f-a015-4de5-84c1-2329b7d95f83/0.30099871785048815.jpeg"
]

print(f"Deleting {len(new_orphans)} additional orphan files...")
try:
    res = supabase.storage.from_(bucket_name).remove(new_orphans)
    print("Storage removal response:", res)
except Exception as e:
    print("Error deleting storage files:", e)

# 2. Get current empty campaigns to be absolutely sure
campaigns_resp = supabase.table("campaigns").select("*").execute()
campaigns = campaigns_resp.data

images_resp = supabase.table("user_images").select("campaign_id").execute()
img_campaign_ids = {img["campaign_id"] for img in images_resp.data}

empty_campaign_ids = [c["id"] for c in campaigns if c["id"] not in img_campaign_ids]

print(f"\nDeleting {len(empty_campaign_ids)} empty campaigns...")
for campaign_id in empty_campaign_ids:
    try:
        # Use simple delete
        res = supabase.table("campaigns").delete().eq("id", campaign_id).execute()
        print(f"Deleted campaign {campaign_id}")
    except Exception as e:
        print(f"Error deleting campaign {campaign_id}: {e}")

print("\nCleanup cycle complete.")
