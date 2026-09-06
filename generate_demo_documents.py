import os
import math
from PIL import Image, ImageDraw, ImageFont

# Directory for demo documents
output_dir = os.path.join(os.path.dirname(__file__), "demo_documents")
os.makedirs(output_dir, exist_ok=True)

# Try loading Windows fonts
def get_fonts():
    fonts = {}
    try:
        fonts['header'] = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 26)
        fonts['sub'] = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
        fonts['label'] = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 15)
        fonts['val'] = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 20)
        fonts['val_bold'] = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 22)
        fonts['mrz'] = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 25)
        fonts['small'] = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 13)
        fonts['stamp'] = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
        fonts['banner'] = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 16)
    except Exception as e:
        print(f"Font loading fallback: {e}")
        default_font = ImageFont.load_default()
        for k in ['header', 'sub', 'label', 'val', 'val_bold', 'mrz', 'small', 'stamp', 'banner']:
            fonts[k] = default_font
    return fonts

FONTS = get_fonts()

def draw_guilloche(draw, width, height, color):
    # Mathematical wavy security patterns
    for y_offset in range(120, height - 120, 24):
        points = []
        for x in range(0, width, 4):
            y = y_offset + 14 * math.sin(x * 0.02) + 8 * math.cos(x * 0.05)
            points.append((x, y))
        for i in range(len(points) - 1):
            draw.line([points[i], points[i+1]], fill=color, width=1)

def draw_portrait(draw, x, y, w, h, gender='M', hair_color=(40, 50, 60), skin_color=(245, 203, 167), tampered=False):
    # Background for portrait
    draw.rectangle([x, y, x + w, y + h], fill=(226, 232, 240), outline=(148, 163, 184), width=2)
    
    # Shoulders
    shoulder_color = (30, 41, 59) if gender == 'M' else (51, 65, 85)
    draw.pieslice([x + 20, y + h - 140, x + w - 20, y + h + 60], 180, 360, fill=shoulder_color)
    
    # Shirt collar
    draw.polygon([(x + w//2 - 25, y + h - 50), (x + w//2, y + h - 15), (x + w//2 + 25, y + h - 50)], fill=(255, 255, 255))
    
    # Neck
    draw.rectangle([x + w//2 - 20, y + h - 90, x + w//2 + 20, y + h - 40], fill=skin_color)
    
    # Face oval
    cx, cy = x + w // 2, y + 120
    draw.ellipse([cx - 55, cy - 65, cx + 55, cy + 65], fill=skin_color, outline=(210, 160, 120), width=1)
    
    # Hair
    if gender == 'M':
        draw.pieslice([cx - 56, cy - 80, cx + 56, cy + 20], 180, 360, fill=hair_color)
    else:
        draw.pieslice([cx - 60, cy - 85, cx + 60, cy + 20], 170, 370, fill=hair_color)
        draw.rectangle([cx - 60, cy - 20, cx - 45, cy + 60], fill=hair_color)
        draw.rectangle([cx + 45, cy - 20, cx + 60, cy + 60], fill=hair_color)
        
    # Eyes
    draw.ellipse([cx - 30, cy - 10, cx - 12, cy], fill=(255, 255, 255), outline=(100, 116, 139))
    draw.ellipse([cx + 12, cy - 10, cx + 30, cy], fill=(255, 255, 255), outline=(100, 116, 139))
    draw.ellipse([cx - 24, cy - 8, cx - 18, cy - 2], fill=(30, 41, 59))
    draw.ellipse([cx + 18, cy - 8, cx + 24, cy - 2], fill=(30, 41, 59))
    
    # Eyebrows
    draw.line([cx - 32, cy - 16, cx - 10, cy - 16], fill=hair_color, width=3)
    draw.line([cx + 10, cy - 16, cx + 32, cy - 16], fill=hair_color, width=3)
    
    # Nose & Mouth
    draw.line([cx, cy - 4, cx - 4, cy + 18], fill=(180, 130, 90), width=2)
    draw.line([cx - 4, cy + 18, cx + 4, cy + 18], fill=(180, 130, 90), width=2)
    draw.line([cx - 15, cy + 34, cx + 15, cy + 34], fill=(190, 80, 80), width=3)
    
    # Watermark overlay
    draw.text((x + 15, y + h - 35), "ICAO 9303 VALID", fill=(148, 163, 184, 128), font=FONTS['small'])

    if tampered:
        # Splicing artifact line & compression border
        draw.rectangle([x - 4, y - 4, x + w + 4, y + h + 4], outline=(239, 68, 68), width=3)
        draw.rectangle([x + w - 70, y + h - 70, x + w - 10, y + h - 10], fill=(220, 38, 38, 60), outline=(239, 68, 68), width=2)
        draw.line([x + 10, y + h - 12, x + w - 10, y + h - 12], fill=(255, 0, 0), width=3)

def draw_emblem(draw, cx, cy, r):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(56, 189, 248), width=3)
    draw.ellipse([cx - r + 6, cy - r + 6, cx + r - 6, cy + r - 6], outline=(234, 179, 8), width=2)
    # Spokes / star
    for i in range(8):
        angle = i * (math.pi / 4)
        x1 = cx + (r - 8) * math.cos(angle)
        y1 = cy + (r - 8) * math.sin(angle)
        draw.line([cx, cy, x1, y1], fill=(56, 189, 248), width=2)

def create_base_passport(country_code, country_name, doc_title="PASSPORT / PASSEPORT"):
    img = Image.new("RGB", (1200, 800), color=(248, 250, 252))
    draw = ImageDraw.Draw(img)
    
    # Soft security gradient background
    for y in range(800):
        shade = int(248 - (y / 800) * 18)
        draw.line([(0, y), (1200, y)], fill=(shade, shade + 2, shade + 5))
        
    # Security guilloche lines
    draw_guilloche(draw, 1200, 800, (14, 165, 233, 50))
    draw_guilloche(draw, 1200, 800, (234, 88, 12, 35))
    
    # Outer secure border
    draw.rectangle([10, 10, 1190, 790], outline=(148, 163, 184), width=2)
    draw.rectangle([16, 16, 1184, 784], outline=(203, 213, 225), width=1)
    
    # Top Header Band
    draw.rectangle([10, 10, 1190, 90], fill=(15, 23, 42))
    draw.text((45, 30), f"{country_name.upper()}", fill=(248, 250, 252), font=FONTS['header'])
    draw.text((820, 34), doc_title, fill=(56, 189, 248), font=FONTS['sub'])
    draw_emblem(draw, 760, 48, 26)
    
    # Bottom MRZ Band
    draw.rectangle([10, 660, 1190, 790], fill=(15, 23, 42))
    draw.line([(10, 660), (1190, 660)], fill=(56, 189, 248), width=3)
    
    # Ghost watermark portrait circle on right
    draw.ellipse([980, 130, 1150, 320], outline=(203, 213, 225), width=2)
    draw.text((1005, 215), "GHOST IMAGE", fill=(148, 163, 184), font=FONTS['small'])
    
    return img, draw

# =========================================================================
# 1. CLEAN VALID PASSPORT (Aditya Sharma)
# =========================================================================
def generate_clean_passport():
    img, draw = create_base_passport("IND", "Republic of India")
    
    # Portrait
    draw_portrait(draw, 50, 130, 260, 350, gender='M', hair_color=(30, 35, 45), skin_color=(245, 203, 167))
    
    # Data Fields
    fields = [
        ("Type / Type", "P", 350, 130),
        ("Country Code / Code Pays", "IND", 520, 130),
        ("Passport No. / No de Passeport", "Z4892104", 720, 130),
        ("Surname / Nom", "SHARMA", 350, 200),
        ("Given Names / Prenoms", "ADITYA", 350, 270),
        ("Nationality / Nationalite", "INDIAN", 350, 340),
        ("Date of Birth / Date de Naissance", "14/05/1992", 650, 340),
        ("Sex / Sexe", "M", 350, 410),
        ("Place of Birth / Lieu de Naissance", "NEW DELHI", 500, 410),
        ("Date of Issue / Date de Delivrance", "13/08/2022", 350, 480),
        ("Date of Expiry / Date d'Expiration", "12/08/2032", 650, 480),
        ("Place of Issue / Autorite", "REGIONAL PASSPORT OFFICE DELHI", 350, 550),
    ]
    
    for label, val, fx, fy in fields:
        draw.text((fx, fy), label.upper(), fill=(100, 116, 139), font=FONTS['label'])
        draw.text((fx, fy + 24), val, fill=(15, 23, 42), font=FONTS['val_bold'])
        draw.line([(fx, fy + 52), (fx + 250, fy + 52)], fill=(226, 232, 240), width=1)
        
    # Genuine Stamp
    draw.ellipse([880, 380, 1120, 560], outline=(14, 165, 233), width=2)
    draw.text((915, 440), "IMMIGRATION BUREAU", fill=(14, 165, 233), font=FONTS['stamp'])
    draw.text((945, 480), "OFFICIAL VERIFIED", fill=(16, 185, 129), font=FONTS['sub'])
    
    # MRZ (ICAO 9303 Compliant)
    mrz1 = "P<INDSHARMA<<ADITYA<<<<<<<<<<<<<<<<<<<<<<<<<"
    mrz2 = "Z4892104<2IND9205148M3208126<<<<<<<<<<<<<<08"
    draw.text((45, 680), mrz1, fill=(248, 250, 252), font=FONTS['mrz'])
    draw.text((45, 725), mrz2, fill=(248, 250, 252), font=FONTS['mrz'])
    
    # Watermark Tag
    draw.rectangle([50, 500, 310, 530], fill=(16, 185, 129))
    draw.text((65, 508), "DEMO: 100% GENUINE PASSPORT", fill=(255, 255, 255), font=FONTS['banner'])
    
    filepath = os.path.join(output_dir, "01_PASS_Passport_Aditya_Sharma_Clean.png")
    img.save(filepath, "PNG", quality=95)
    print(f"Generated: {filepath}")

# =========================================================================
# 2. TAMPERED PHOTO PASSPORT (Viktor Korzhov)
# =========================================================================
def generate_tampered_photo_passport():
    img, draw = create_base_passport("RUS", "Russian Federation")
    
    # Portrait with deliberate tampering / cut artifact
    draw_portrait(draw, 50, 130, 260, 350, gender='M', hair_color=(120, 53, 15), skin_color=(254, 215, 170), tampered=True)
    
    # Data Fields
    fields = [
        ("Type / Type", "P", 350, 130),
        ("Country Code / Code Pays", "RUS", 520, 130),
        ("Passport No. / No de Passeport", "759281043", 720, 130),
        ("Surname / Nom", "KORZHOV", 350, 200),
        ("Given Names / Prenoms", "VIKTOR", 350, 270),
        ("Nationality / Nationalite", "RUSSIAN FEDERATION", 350, 340),
        ("Date of Birth / Date de Naissance", "12/04/1988", 650, 340),
        ("Sex / Sexe", "M", 350, 410),
        ("Place of Birth / Lieu de Naissance", "MOSCOW", 500, 410),
        ("Date of Issue / Date de Delivrance", "25/10/2019", 350, 480),
        ("Date of Expiry / Date d'Expiration", "24/10/2029", 650, 480),
        ("Place of Issue / Autorite", "FMS 77001", 350, 550),
    ]
    
    for label, val, fx, fy in fields:
        draw.text((fx, fy), label.upper(), fill=(100, 116, 139), font=FONTS['label'])
        draw.text((fx, fy + 24), val, fill=(15, 23, 42), font=FONTS['val_bold'])
        draw.line([(fx, fy + 52), (fx + 250, fy + 52)], fill=(226, 232, 240), width=1)
        
    # Anomaly indicator
    draw.rectangle([45, 125, 315, 485], outline=(239, 68, 68), width=3)
    draw.text((55, 102), "⚠️ PHOTO REPLACEMENT SEAM DETECTED", fill=(239, 68, 68), font=FONTS['sub'])
    
    # MRZ
    mrz1 = "P<RUSKORZHOV<<VIKTOR<<<<<<<<<<<<<<<<<<<<<<<<"
    mrz2 = "7592810431RUS8804123M2910245<<<<<<<<<<<<<<04"
    draw.text((45, 680), mrz1, fill=(248, 250, 252), font=FONTS['mrz'])
    draw.text((45, 725), mrz2, fill=(248, 250, 252), font=FONTS['mrz'])
    
    # Watermark Tag
    draw.rectangle([50, 500, 310, 530], fill=(239, 68, 68))
    draw.text((60, 508), "DEMO: PHOTO TAMPERED (FAIL)", fill=(255, 255, 255), font=FONTS['banner'])
    
    filepath = os.path.join(output_dir, "02_FAIL_Passport_Viktor_Tampered_Photo.png")
    img.save(filepath, "PNG", quality=95)
    print(f"Generated: {filepath}")

# =========================================================================
# 3. ALTERED DATE OF BIRTH (Elena Rostova)
# =========================================================================
def generate_altered_dob_passport():
    img, draw = create_base_passport("DEU", "Federal Republic of Germany")
    
    # Portrait
    draw_portrait(draw, 50, 130, 260, 350, gender='F', hair_color=(180, 83, 9), skin_color=(254, 226, 226))
    
    # Data Fields
    fields = [
        ("Type / Type", "P", 350, 130),
        ("Country Code / Code Pays", "DEU", 520, 130),
        ("Passport No. / No de Passeport", "C4X092815", 720, 130),
        ("Surname / Nom", "ROSTOVA", 350, 200),
        ("Given Names / Prenoms", "ELENA", 350, 270),
        ("Nationality / Nationalite", "GERMAN", 350, 340),
        ("Date of Birth / Date de Naissance", "22/09/1998", 650, 340), # Altered visually to 1998!
        ("Sex / Sexe", "F", 350, 410),
        ("Place of Birth / Lieu de Naissance", "BERLIN", 500, 410),
        ("Date of Issue / Date de Delivrance", "01/01/2022", 350, 480),
        ("Date of Expiry / Date d'Expiration", "31/12/2031", 650, 480),
        ("Place of Issue / Autorite", "STADT BERLIN", 350, 550),
    ]
    
    for label, val, fx, fy in fields:
        draw.text((fx, fy), label.upper(), fill=(100, 116, 139), font=FONTS['label'])
        if "Birth" in label:
            # Overwrite with obvious white-out patch and mismatched font
            draw.rectangle([fx - 6, fy + 20, fx + 220, fy + 54], fill=(255, 255, 255), outline=(239, 68, 68), width=2)
            draw.text((fx + 4, fy + 24), "22/09/1998", fill=(220, 38, 38), font=FONTS['val_bold'])
            draw.text((fx + 230, fy + 26), "⚠️ ALTERED", fill=(239, 68, 68), font=FONTS['sub'])
        else:
            draw.text((fx, fy + 24), val, fill=(15, 23, 42), font=FONTS['val_bold'])
        draw.line([(fx, fy + 52), (fx + 250, fy + 52)], fill=(226, 232, 240), width=1)
        
    # MRZ has genuine DOB 850922 (1985) which clashes with visual 1998!
    mrz1 = "P<DEUROSTOVA<<ELENA<<<<<<<<<<<<<<<<<<<<<<<<<"
    mrz2 = "C4X0928157DEU8509224F3112318<<<<<<<<<<<<<<02"
    draw.text((45, 680), mrz1, fill=(248, 250, 252), font=FONTS['mrz'])
    draw.text((45, 725), mrz2, fill=(248, 250, 252), font=FONTS['mrz'])
    
    # Watermark Tag
    draw.rectangle([50, 500, 310, 530], fill=(234, 88, 12))
    draw.text((58, 508), "DEMO: DOB & CHECKSUM FRAUD", fill=(255, 255, 255), font=FONTS['banner'])
    
    filepath = os.path.join(output_dir, "03_FAIL_Passport_Elena_Altered_DOB.png")
    img.save(filepath, "PNG", quality=95)
    print(f"Generated: {filepath}")

# =========================================================================
# 4. FORGED VISA STAMP (Rajesh Patel)
# =========================================================================
def generate_forged_visa():
    img = Image.new("RGB", (1200, 800), color=(254, 252, 232)) # Visa paper tint
    draw = ImageDraw.Draw(img)
    
    # Border & Guilloche
    draw.rectangle([15, 15, 1185, 785], outline=(161, 98, 7), width=3)
    draw_guilloche(draw, 1200, 800, (202, 138, 4, 40))
    
    # Header
    draw.rectangle([15, 15, 1185, 95], fill=(30, 41, 59))
    draw.text((45, 32), "SCHENGEN VISA / VISA DE COURT SEJOUR", fill=(248, 250, 252), font=FONTS['header'])
    draw.text((950, 36), "TYPE C - TOURIST", fill=(234, 179, 8), font=FONTS['sub'])
    
    # Portrait
    draw_portrait(draw, 50, 135, 240, 320, gender='M', hair_color=(20, 20, 20), skin_color=(217, 119, 6))
    
    # Fields
    fields = [
        ("Valid For / Valable Pour", "ETATS SCHENGEN", 340, 135),
        ("Visa Number", "V9812401", 720, 135),
        ("From / Du", "01/09/2026", 340, 210),
        ("Until / Au", "30/09/2026", 720, 210),
        ("Number of Entries / Nombre d'Entrees", "MULT", 340, 285),
        ("Duration of Stay / Duree de Sejour", "90 DAYS (Altered from 30)", 650, 285),
        ("Issued In / Delivre A", "NEW DELHI", 340, 360),
        ("On / Le", "20/08/2026", 650, 360),
        ("Passport Number", "Z9018471", 340, 435),
        ("Holder Surname, Name", "PATEL, RAJESH", 650, 435),
    ]
    
    for label, val, fx, fy in fields:
        draw.text((fx, fy), label.upper(), fill=(148, 163, 184), font=FONTS['label'])
        if "Duration" in label:
            draw.rectangle([fx - 4, fy + 20, fx + 320, fy + 54], fill=(254, 202, 202), outline=(220, 38, 38), width=2)
            draw.text((fx + 4, fy + 24), val, fill=(185, 28, 28), font=FONTS['val_bold'])
        else:
            draw.text((fx, fy + 24), val, fill=(15, 23, 42), font=FONTS['val_bold'])
        draw.line([(fx, fy + 50), (fx + 280, fy + 50)], fill=(226, 232, 240), width=1)
        
    # Forged Ink Stamp with RGB bleeding
    draw.rectangle([780, 440, 1120, 620], outline=(220, 38, 38), width=4)
    draw.text((800, 460), "★ REPUBLIQUE FRANCAISE ★", fill=(185, 28, 28), font=FONTS['stamp'])
    draw.text((830, 500), "DOUANES FRANCAISES", fill=(220, 38, 38), font=FONTS['sub'])
    draw.text((840, 540), "DATE: 01/09/2026", fill=(220, 38, 38), font=FONTS['val'])
    draw.text((805, 580), "⚠️ FORGED STAMP PIGMENT ANOMALY", fill=(220, 38, 38), font=FONTS['small'])
    
    # MRZ
    draw.rectangle([15, 660, 1185, 785], fill=(30, 41, 59))
    draw.line([(15, 660), (1185, 660)], fill=(234, 179, 8), width=3)
    draw.text((45, 680), "VN9812401<<IND<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", fill=(248, 250, 252), font=FONTS['mrz'])
    draw.text((45, 725), "PATEL<<RAJESH<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", fill=(248, 250, 252), font=FONTS['mrz'])
    
    # Watermark Tag
    draw.rectangle([50, 480, 290, 510], fill=(220, 38, 38))
    draw.text((60, 488), "DEMO: FORGED VISA STAMP", fill=(255, 255, 255), font=FONTS['banner'])
    
    filepath = os.path.join(output_dir, "04_FAIL_Visa_Rajesh_Forged_Stamp.png")
    img.save(filepath, "PNG", quality=95)
    print(f"Generated: {filepath}")

# =========================================================================
# 5. INTERPOL WANTED & EXPIRED (Carlos Mendez)
# =========================================================================
def generate_interpol_hit_passport():
    img, draw = create_base_passport("VEN", "Republica Bolivariana de Venezuela")
    
    # Portrait
    draw_portrait(draw, 50, 130, 260, 350, gender='M', hair_color=(15, 23, 42), skin_color=(217, 119, 6))
    
    # Data Fields
    fields = [
        ("Tipo / Type", "P", 350, 130),
        ("Codigo / Code", "VEN", 520, 130),
        ("No. Pasaporte / Passport No.", "P10928374", 720, 130),
        ("Apellidos / Surname", "MENDEZ", 350, 200),
        ("Nombres / Given Names", "CARLOS ENRIQUE", 350, 270),
        ("Nacionalidad / Nationality", "VENEZOLANA", 350, 340),
        ("Fecha de Nacimiento / DOB", "03/07/1979", 650, 340),
        ("Sexo / Sex", "M", 350, 410),
        ("Lugar de Nacimiento / POB", "CARACAS", 500, 410),
        ("Fecha de Expedicion / DOI", "12/04/2011", 350, 480),
        ("Fecha de Caducidad / DOE", "11/04/2021 (EXPIRED)", 650, 480), # EXPIRED!
        ("Autoridad / Authority", "SAIME CARACAS", 350, 550),
    ]
    
    for label, val, fx, fy in fields:
        draw.text((fx, fy), label.upper(), fill=(100, 116, 139), font=FONTS['label'])
        if "EXPIRED" in val:
            draw.rectangle([fx - 4, fy + 20, fx + 310, fy + 54], fill=(254, 202, 202), outline=(220, 38, 38), width=2)
            draw.text((fx + 4, fy + 24), val, fill=(185, 28, 28), font=FONTS['val_bold'])
        else:
            draw.text((fx, fy + 24), val, fill=(15, 23, 42), font=FONTS['val_bold'])
        draw.line([(fx, fy + 52), (fx + 250, fy + 52)], fill=(226, 232, 240), width=1)
        
    # Interpol Warning Banner across document
    draw.rectangle([340, 510, 1150, 590], fill=(153, 27, 27), outline=(254, 202, 202), width=3)
    draw.text((360, 520), "🚨 INTERPOL RED NOTICE MATCH #RN-8921-X9", fill=(255, 255, 255), font=FONTS['header'])
    draw.text((360, 555), "WANTED FOR TRANSNATIONAL FINANCIAL FRAUD - ARREST UPON DETECTION", fill=(254, 202, 202), font=FONTS['sub'])
    
    # MRZ
    mrz1 = "P<VENMENDEZ<<CARLOS<ENRIQUE<<<<<<<<<<<<<<<<<"
    mrz2 = "P109283748VEN7907031M2104115<<<<<<<<<<<<<<02"
    draw.text((45, 680), mrz1, fill=(248, 250, 252), font=FONTS['mrz'])
    draw.text((45, 725), mrz2, fill=(248, 250, 252), font=FONTS['mrz'])
    
    # Watermark Tag
    draw.rectangle([50, 500, 310, 530], fill=(153, 27, 27))
    draw.text((55, 508), "DEMO: INTERPOL RED NOTICE", fill=(255, 255, 255), font=FONTS['banner'])
    
    filepath = os.path.join(output_dir, "05_FAIL_Passport_Carlos_Interpol_Hit.png")
    img.save(filepath, "PNG", quality=95)
    print(f"Generated: {filepath}")

if __name__ == "__main__":
    print("Generating SentinelBorder AI demo passport files...")
    generate_clean_passport()
    generate_tampered_photo_passport()
    generate_altered_dob_passport()
    generate_forged_visa()
    generate_interpol_hit_passport()
    print("All 5 demo passport images generated successfully!")
