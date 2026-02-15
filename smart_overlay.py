import sys
import os
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from io import BytesIO
import random
import base64
import json

def load_font(size):
    # Try to load a robust font, fallback to default
    try:
        # Windows standard font paths or a local font file
        # Check for common fonts
        options = ["arial.ttf", "segoeui.ttf", "impact.ttf"]
        for opt in options:
            try:
                return ImageFont.truetype(opt, size)
            except IOError:
                continue
        return ImageFont.load_default()
    except Exception:
        return ImageFont.load_default()

def apply_text_overlay(image_url, promo_text, variation):
    try:
        # Download image
        response = requests.get(image_url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content)).convert("RGBA")
        
        width, height = img.size
        # Create a transparent layer for drawing
        txt_layer = Image.new("RGBA", (width, height), (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt_layer)

        # Basic variation logic
        if variation == 'minimal_bottom_left':
            # Small, white text, bottom left with slight shadow
            font_size = int(height * 0.05)
            font = load_font(font_size)
            x, y = int(width * 0.05), int(height * 0.9)
            
            # Shadow
            draw.text((x+2, y+2), promo_text, font=font, fill=(0, 0, 0, 180))
            # Text
            draw.text((x, y), promo_text, font=font, fill=(255, 255, 255, 255))

        elif variation == 'bold_center':
            # Big yellow text, centered, with black outline/background
            font_size = int(height * 0.1)
            font = load_font(font_size)
            
            # Calculate text size using getbbox
            left, top, right, bottom = draw.textbbox((0, 0), promo_text, font=font)
            text_w = right - left
            text_h = bottom - top
            
            x = (width - text_w) / 2
            y = (height - text_h) / 2
            
            # Semi-transparent black box behind text
            padding = 20
            draw.rectangle([x - padding, y - padding, x + text_w + padding, y + text_h + padding], fill=(0, 0, 0, 160))
            
            # Yellow Text
            draw.text((x, y), promo_text, font=font, fill=(255, 215, 0, 255)) # Gold color

        elif variation == 'badge_top_right':
            # Circular badge with text inside
            badge_size = int(height * 0.2)
            margin = int(width * 0.05)
            x_circle = width - badge_size - margin
            y_circle = margin
            
            # Draw Red Circle
            draw.ellipse([x_circle, y_circle, x_circle + badge_size, y_circle + badge_size], fill=(220, 20, 60, 230))
            
            # Text inside
            font_size = int(badge_size * 0.25)
            font = load_font(font_size)
            
            # Wrap text roughly (simple split)
            words = promo_text.split()
            # Very basic word wrap logic for demo
            if len(words) > 1:
                line1 = " ".join(words[:len(words)//2])
                line2 = " ".join(words[len(words)//2:])
                
                # Draw Line 1
                l1_left, l1_top, l1_right, l1_bottom = draw.textbbox((0,0), line1, font=font)
                l1_w = l1_right - l1_left
                l1_h = l1_bottom - l1_top
                draw.text((x_circle + (badge_size-l1_w)/2, y_circle + badge_size/3), line1, font=font, fill=(255,255,255,255))
                
                # Draw Line 2
                l2_left, l2_top, l2_right, l2_bottom = draw.textbbox((0,0), line2, font=font)
                l2_w = l2_right - l2_left
                draw.text((x_circle + (badge_size-l2_w)/2, y_circle + badge_size/3 + l1_h + 5), line2, font=font, fill=(255,255,255,255))
            else:
                 # Single line
                l_left, l_top, l_right, l_bottom = draw.textbbox((0,0), promo_text, font=font)
                l_w = l_right - l_left
                draw.text((x_circle + (badge_size-l_w)/2, y_circle + (badge_size)/2 - l_bottom/2), promo_text, font=font, fill=(255,255,255,255))

        elif variation == 'elegant_top_center':
             # Thin font, top center, subtle dark gradient
            font_size = int(height * 0.06)
            font = load_font(font_size) # Default font is likely sans-serif but works for placeholder
            
            # Gradient overlay at top
            # Gradient overlay at top - SIMPLIFIED for stability
            # removed complex loop, using rectangle below

                
            # Actually simpler: just perform a draw with semi-transparent black rect
            draw.rectangle([0, 0, width, height*0.15], fill=(0,0,0,100))
            
            l_left, l_top, l_right, l_bottom = draw.textbbox((0,0), promo_text, font=font)
            l_w = l_right - l_left
            
            x = (width - l_w) / 2
            y = int(height * 0.04)
            
            draw.text((x, y), promo_text, font=font, fill=(255, 255, 255, 255), spacing=4)

        # Composite
        out = Image.alpha_composite(img, txt_layer)
        
        # Convert to RGB to save as JPEG/PNG
        out = out.convert("RGB")
        
        # Determine output path or return bytes
        # For this script, we will save locally to a temp folder and return the path
        # Or better: return base64 for n8n to handle
        
        buffered = BytesIO()
        out.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return img_str

    except Exception as e:
        return str(e)

if __name__ == "__main__":
    # Expecting arguments: image_url, promo_text
    # Output: JSON object with 4 variations in base64
    
    # Mock data for local testing if no args
    if len(sys.argv) < 3:
        # print("Usage: python smart_overlay.py <image_url> <promo_text>")
        # sys.exit(1)
        # Mocking for demo purposes if run directly
        url = "https://img.freepik.com/free-photo/fresh-burger-with-ingredients_144627-9430.jpg" # Random safe placeholder
        text = "25% OFF TODAY"
    else:
        url = sys.argv[1]
        text = sys.argv[2]
    
    variations = ['minimal_bottom_left', 'bold_center', 'badge_top_right', 'elegant_top_center']
    results = {}
    
    for v in variations:
        res = apply_text_overlay(url, text, v)
        if not res.startswith("Error"):
            results[v] = res
        else:
            results[v] = None
            
    # Print JSON output for n8n to capture
    # In n8n, use the "Execute Command" node and parse this JSON
    print(json.dumps(results))
