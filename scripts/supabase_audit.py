import os
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase URL or Key not found in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def list_all_storage_files(bucket_name):
    all_files = []
    
    async def walk(path=""):
        try:
            # list is synchronous in the current supabase-py? Let's check.
            # Actually we'll use synchronous calls for simplicity if it works.
            items = supabase.storage.from_(bucket_name).list(path)
            for item in items:
                name = item["name"]
                full_path = f"{path}/{name}" if path else name
                
                # If there's no metadata or it's empty, it's likely a folder
                if "metadata" not in item or not item["metadata"]:
                    # Recursively walk
                    await walk(full_path)
                else:
                    all_files.append(full_path)
        except Exception as e:
            print(f"Error listing path '{path}': {e}")

    await walk()
    return all_files

async def audit_images():
    print("--- Auditing Images ---")
    
    # Get all DB images
    db_images_resp = supabase.table("user_images").select("*").execute()
    db_images = db_images_resp.data
    db_urls = {img["image_url"] for img in db_images}
    
    # Get all Storage files
    storage_files = await list_all_storage_files("product-images")

    print(f"Total DB images: {len(db_images)}")
    print(f"Total Storage files: {len(storage_files)}")
    
    prefix = f"{SUPABASE_URL}/storage/v1/object/public/product-images/"
    
    db_paths = set()
    for url in db_urls:
        if url.startswith(prefix):
            path = url[len(prefix):]
            db_paths.add(path)
        else:
            # Handle potential different URL formats
            if "/storage/v1/object/public/product-images/" in url:
                path = url.split("/storage/v1/object/public/product-images/")[1].split("?")[0]
                db_paths.add(path)
            else:
                print(f"Non-standard URL found: {url}")

    missing_in_storage = db_paths - set(storage_files)
    orphans_in_storage = set(storage_files) - db_paths

    if missing_in_storage:
        print(f"\n[!] ALERT: {len(missing_in_storage)} DB entries with NO file in Storage:")
        for path in list(missing_in_storage)[:10]:
            print(f"  - {path}")
    else:
        print("\n[OK] All DB images exist in Storage.")

    if orphans_in_storage:
        print(f"\n[!] ALERT: {len(orphans_in_storage)} Files in Storage with NO DB entry:")
        for path in list(orphans_in_storage)[:10]:
            print(f"  - {path}")
    else:
        print("\n[OK] No orphan files in Storage.")

async def audit_profiles():
    print("\n--- Auditing Profiles ---")
    profiles_resp = supabase.table("profiles").select("*").execute()
    profiles = profiles_resp.data
    
    print(f"Total Profiles: {len(profiles)}")
    
    onboarding_complete = [p for p in profiles if p.get("onboarding_completed")]
    with_notifications = [p for p in profiles if p.get("push_subscription")]
    
    print(f"Onboarding Complete: {len(onboarding_complete)}")
    print(f"With Push Notifications enabled: {len(with_notifications)}")
    
    # Check if some business names are defaults or empty
    empty_names = [p["id"] for p in onboarding_complete if not p.get("business_name")]
    if empty_names:
        print(f"[!] Users with completed onboarding but NO business_name: {len(empty_names)}")

async def audit_campaigns():
    print("\n--- Auditing Campaigns ---")
    campaigns_resp = supabase.table("campaigns").select("*").execute()
    campaigns = campaigns_resp.data
    
    images_resp = supabase.table("user_images").select("campaign_id").execute()
    img_campaign_ids = {img["campaign_id"] for img in images_resp.data}
    
    empty_campaigns = [c for c in campaigns if c["id"] not in img_campaign_ids]
    print(f"Total Campaigns: {len(campaigns)}")
    print(f"Empty Campaigns (no images): {len(empty_campaigns)}")

async def main():
    await audit_images()
    await audit_profiles()
    await audit_campaigns()

if __name__ == "__main__":
    asyncio.run(main())
