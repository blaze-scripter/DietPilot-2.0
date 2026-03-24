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