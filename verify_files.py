import os, re

files = ['index.html', 'styles.css', 'app.js', 'assets.js']
url_re = re.compile(r'https?://[^\s"\'\)]+', re.IGNORECASE)

print("--- OFFLINE AUDIT REPORT ---")
total_ext = 0
for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    matches = url_re.findall(content)
    total_ext += len(matches)
    print(f"{fname}: {len(matches)} external URLs found.")
    for m in matches:
        print(f"   [EXTERNAL URL]: {m}")

if total_ext == 0:
    print("SUCCESS: 100% OFFLINE! Zero external network URLs found in all codebase files.")
else:
    print(f"WARNING: {total_ext} external URLs remaining.")
