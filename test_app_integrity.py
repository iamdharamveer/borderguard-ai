import os, re

def test_integrity():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    errors = []

    # 1. Check DOM IDs queried in app.js
    id_matches = re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", js)
    unique_ids = set(id_matches)
    for elem_id in unique_ids:
        if f'id="{elem_id}"' not in html and f"id='{elem_id}'" not in html:
            errors.append(f"Missing ID in index.html: {elem_id}")

    # 2. Check Demo files exist
    demo_files = [
        "demo_documents/01_PASS_Passport_Aditya_Sharma_Clean.png",
        "demo_documents/02_FAIL_Passport_Viktor_Tampered_Photo.png",
        "demo_documents/03_FAIL_Passport_Elena_Altered_DOB.png",
        "demo_documents/04_FAIL_Visa_Rajesh_Forged_Stamp.png",
        "demo_documents/05_FAIL_Passport_Carlos_Interpol_Hit.png"
    ]
    for df in demo_files:
        if not os.path.exists(df):
            errors.append(f"Missing demo file: {df}")
        else:
            sz = os.path.getsize(df)
            print(f"Verified demo file: {df} ({sz} bytes)")

    # 3. Check offline URLs
    url_re = re.compile(r'https?://[^\s"\'\)]+', re.IGNORECASE)
    for fname, content in [('index.html', html), ('app.js', js), ('styles.css', css)]:
        found = url_re.findall(content)
        if found:
            errors.append(f"Found external URL in {fname}: {found}")

    print("\n--- TEST INTEGRITY SUMMARY ---")
    if errors:
        for err in errors:
            print(f"FAILED: {err}")
    else:
        print("ALL TESTS PASSED! 100% Offline, all DOM element IDs accounted for, all demo document files generated and present.")

if __name__ == '__main__':
    test_integrity()
