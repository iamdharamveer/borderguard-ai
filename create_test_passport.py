import math
from PIL import Image, ImageDraw, ImageFont

def generate_test_passport():
    W, H = 1050, 720
    # Create high-res image
    img = Image.new('RGB', (W, H), (242, 240, 230))
    draw = ImageDraw.Draw(img)

    # 1. Subtle Guilloche Security Background Pattern
    for y in range(0, H, 8):
        for x in range(0, W, 8):
            v = int(235 + 12 * math.sin(x * 0.03) * math.cos(y * 0.04))
            draw.point((x, y), fill=(v, v - 4, v - 10))

    # Fine security wave lines
    for i in range(12):
        points = []
        offset_y = 60 + i * 45
        for x in range(0, W, 10):
            y = offset_y + 14 * math.sin((x + i * 30) * 0.015) + 6 * math.cos(x * 0.04)
            points.append((x, y))
        draw.line(points, fill=(215, 222, 238), width=1)

    # Decorative header band
    draw.rectangle([(0, 0), (W, 75)], fill=(20, 36, 68))
    # Header gold accent lines
    draw.line([(0, 72), (W, 72)], fill=(212, 175, 55), width=3)
    draw.line([(0, 76), (W, 76)], fill=(230, 200, 90), width=1)

    # Header text
    try:
        font_head_large = ImageFont.truetype("arialbd.ttf", 26)
        font_head_sub = ImageFont.truetype("arial.ttf", 13)
        font_lbl = ImageFont.truetype("arial.ttf", 11)
        font_val = ImageFont.truetype("arialbd.ttf", 16)
        font_mrz = ImageFont.truetype("courbd.ttf", 22)
    except:
        font_head_large = ImageFont.load_default()
        font_head_sub = ImageFont.load_default()
        font_lbl = ImageFont.load_default()
        font_val = ImageFont.load_default()
        font_mrz = ImageFont.load_default()

    draw.text((40, 14), "UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND", fill=(255, 255, 255), font=font_head_large)
    draw.text((40, 48), "PASSPORT  •  PASSEPORT  •  TYPE P  •  CODE GBR", fill=(212, 175, 55), font=font_head_sub)

    # ICAO Chip Icon (Biometric e-Passport symbol)
    chip_x, chip_y = W - 110, 22
    draw.rectangle([(chip_x, chip_y), (chip_x + 60, chip_y + 36)], outline=(212, 175, 55), width=2)
    draw.ellipse([(chip_x + 18, chip_y + 6), (chip_x + 42, chip_y + 30)], outline=(212, 175, 55), width=2)
    draw.line([(chip_x, chip_y + 18), (chip_x + 18, chip_y + 18)], fill=(212, 175, 55), width=2)
    draw.line([(chip_x + 42, chip_y + 18), (chip_x + 60, chip_y + 18)], fill=(212, 175, 55), width=2)

    # 2. Portrait Photo Box (Left Side)
    px, py, pw, ph = 45, 110, 240, 310
    draw.rectangle([(px - 4, py - 4), (px + pw + 4, py + ph + 4)], fill=(255, 255, 255), outline=(180, 185, 195), width=2)
    # Photo background
    draw.rectangle([(px, py), (px + pw, py + ph)], fill=(210, 222, 235))

    # Draw stylized, professional portrait
    cx, cy = px + pw // 2, py + ph // 2 - 20
    # Head & Neck
    draw.ellipse([(cx - 52, cy - 65), (cx + 52, cy + 50)], fill=(244, 212, 192)) # face
    # Hair
    draw.ellipse([(cx - 58, cy - 80), (cx + 58, cy - 10)], fill=(80, 45, 22))
    draw.rectangle([(cx - 58, cy - 40), (cx - 45, cy + 25)], fill=(80, 45, 22))
    draw.rectangle([(cx + 45, cy - 40), (cx + 58, cy + 25)], fill=(80, 45, 22))
    # Eyes
    draw.ellipse([(cx - 28, cy - 12), (cx - 14, cy - 2)], fill=(255, 255, 255))
    draw.ellipse([(cx + 14, cy - 12), (cx + 28, cy - 2)], fill=(255, 255, 255))
    draw.ellipse([(cx - 23, cy - 10), (cx - 17, cy - 4)], fill=(45, 80, 120))
    draw.ellipse([(cx + 19, cy - 10), (cx + 25, cy - 4)], fill=(45, 80, 120))
    # Nose & Mouth
    draw.line([(cx, cy - 6), (cx, cy + 12)], fill=(205, 160, 140), width=2)
    draw.line([(cx - 15, cy + 25), (cx + 15, cy + 25)], fill=(195, 110, 105), width=3)
    # Shoulders / Professional dark blue blazer
    draw.ellipse([(cx - 100, cy + 55), (cx + 100, cy + 220)], fill=(25, 40, 70))
    # Shirt collar
    draw.polygon([(cx - 20, cy + 55), (cx + 20, cy + 55), (cx, cy + 90)], fill=(255, 255, 255))

    # Holographic security overlay on photo edge
    for h_i in range(5):
        h_y = py + 40 + h_i * 50
        draw.arc([(px + pw - 40, h_y), (px + pw + 20, h_y + 40)], start=90, end=270, fill=(180, 210, 245), width=2)

    # Ghost Watermark portrait (subtle security feature in center-right)
    gx, gy = 760, 230
    draw.ellipse([(gx - 35, gy - 40), (gx + 35, gy + 35)], fill=(235, 238, 245), outline=(215, 222, 235), width=1)
    draw.text((gx - 30, gy + 45), "GBR 948210375", fill=(195, 202, 218), font=font_lbl)

    # 3. Data Fields (Right of photo)
    fields = [
        ("Type / Type", "P", "Code of State / Pays émetteur", "GBR", 105),
        ("Passport No. / Passeport No.", "948210375", "National ID / No. Personnel", "7940618029", 150),
        ("Surname / Nom", "CONNER", "", "", 195),
        ("Given Names / Prénoms", "SARAH JANE", "", "", 240),
        ("Nationality / Nationalité", "BRITISH CITIZEN", "Sex / Sexe", "F", 285),
        ("Date of Birth / Date de naissance", "18 JUN / JUIN 1994", "Place of Birth / Lieu de naissance", "LONDON", 330),
        ("Date of Issue / Date de délivrance", "10 OCT / OCT 2021", "Authority / Autorité", "HMPO", 375),
        ("Date of Expiry / Date d'expiration", "09 OCT / OCT 2031", "Holder's Signature", "Sarah J. Conner", 420),
    ]

    col1_x, col2_x = 320, 680
    for f in fields:
        y_pos = f[4]
        # Col 1
        draw.text((col1_x, y_pos), f[0], fill=(110, 115, 125), font=font_lbl)
        draw.text((col1_x, y_pos + 15), f[1], fill=(15, 25, 45), font=font_val)

        # Col 2
        if f[2]:
            draw.text((col2_x, y_pos), f[2], fill=(110, 115, 125), font=font_lbl)
            if "Signature" in f[2]:
                # Stylized cursive signature
                draw.text((col2_x, y_pos + 13), f[3], fill=(20, 35, 80), font=font_val)
            else:
                draw.text((col2_x, y_pos + 15), f[3], fill=(15, 25, 45), font=font_val)

    # Security Microprint Line above MRZ
    draw.line([(30, 525), (W - 30, 525)], fill=(180, 185, 200), width=1)
    micro_text = "UNITED KINGDOM IMMIGRATION AND PASSPORT SERVICE • ICAO DOC 9303 COMPLIANT • OFFICIAL TRAVEL DOCUMENT • " * 3
    draw.text((32, 513), micro_text[:120], fill=(160, 165, 180), font=font_lbl)

    # 4. Machine Readable Zone (MRZ) - High security contrast background
    mrz_box = [(25, 540), (W - 25, 695)]
    draw.rectangle(mrz_box, fill=(248, 248, 244), outline=(210, 215, 225), width=2)

    # Subtle fine security grid in MRZ
    for my in range(545, 690, 10):
        draw.line([(30, my), (W - 30, my)], fill=(240, 240, 238), width=1)

    # Official ICAO Doc 9303 TD3 standard 44-character strings:
    # Line 1: P<GBRCONNER<<SARAH<JANE<<<<<<<<<<<<<<<<<<<<<
    # Line 2: 9482103757GBR9406184F3110098<<<<<<<<<<<<<<02
    line1 = "P<GBRCONNER<<SARAH<JANE<<<<<<<<<<<<<<<<<<<<<"
    line2 = "9482103757GBR9406184F3110098<<<<<<<<<<<<<<02"

    draw.text((50, 565), line1, fill=(20, 25, 35), font=font_mrz)
    draw.text((50, 625), line2, fill=(20, 25, 35), font=font_mrz)

    # Save to disk
    filename = "Traveler_Passport_Scan_Official.png"
    img.save(filename, format="PNG", quality=95)
    print(f"Successfully generated high-resolution test document: {filename}")

if __name__ == '__main__':
    generate_test_passport()
