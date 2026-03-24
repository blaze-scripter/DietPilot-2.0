import os
import re

def resolve_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Improved pattern with re.DOTALL and flexible spacing
    pattern = re.compile(r'<<<<<<< Updated upstream[\s\S]*?=======([\s\S]*?)>>>>>>> Stashed changes', re.MULTILINE)
    
    new_content = pattern.sub(r'\1', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Resolved conflicts in: {filepath}")
    else:
        print(f"No conflicts found in: {filepath}")

pages_dir = r'c:\Users\pcsha\dev\Project DD 2.0\frontend\src\pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.tsx') or filename.endswith('.ts'):
        resolve_file(os.path.join(pages_dir, filename))
Error: src/pages/Dashboard.tsx(140,15): error TS2657: JSX expressions must have one parent element.
Error: src/pages/Dashboard.tsx(163,13): error TS1005: ')' expected.
Error: src/pages/Dashboard.tsx(164,13): error TS1381: Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
Error: src/pages/Dashboard.tsx(169,7): error TS1005: ')' expected.
Error: src/pages/Dashboard.tsx(299,5): error TS1128: Declaration or statement expected.
Error: src/pages/Dashboard.tsx(300,3): error TS1109: Expression expected.
Error: src/pages/HealthConditions.tsx(163,1): error TS1005: '}' expected.
Error: src/pages/Stats.tsx(45,16): error TS1005: ',' expected.
Error: Process completed with exit code 1.