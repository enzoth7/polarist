import smart_overlay
import base64
import os
import sys

# Default test values
url = "https://img.freepik.com/free-photo/fresh-burger-with-ingredients_144627-9430.jpg"
text = "25% OFF TODAY"

# Allow override from CLI
if len(sys.argv) > 2:
    url = sys.argv[1]
    text = sys.argv[2]

variations = ['minimal_bottom_left', 'bold_center', 'badge_top_right', 'elegant_top_center']

output_dir = "test_output"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print(f"Generating images for: {text} | URL: {url}...")

try:
    for v in variations:
        res = smart_overlay.apply_text_overlay(url, text, v)
        if res and not res.startswith("Error"):
            # Decode base64
            img_data = base64.b64decode(res)
            file_path = f"{output_dir}/test_{v}.png"
            with open(file_path, "wb") as f:
                f.write(img_data)
            print(f"Saved {file_path}")
        else:
            print(f"Error for {v}: {res}")
    print("\n✅ Verification Complete. Check the 'test_output' folder.")

except Exception as e:
    print(f"❌ Script Failed: {e}")
