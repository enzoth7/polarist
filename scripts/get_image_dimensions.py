import os
from PIL import Image

def get_image_info(path):
    try:
        with Image.open(path) as img:
            return f"{path}: {img.size[0]}x{img.size[1]} (original)"
    except Exception as e:
        return f"{path}: Error - {e}"

public_dir = r"c:\Users\Enzog\OneDrive\Escritorio\Agente\Work and Producitvity\Projects\Polarist\polarist\public"
images = ["cake_after.jpeg", "cake_before.jpeg", "taco_after.jpeg", "taco_before.jpeg"]

for img_name in images:
    full_path = os.path.join(public_dir, img_name)
    print(get_image_info(full_path))
