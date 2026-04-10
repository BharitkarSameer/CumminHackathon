import os

path = r'c:\Users\ARCHIT\Documents\hackathon\CumminHackathon\client\src\pages\CoverPage.jsx'
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # We want to remove lines 246, 247, 248 (1-indexed)
    # Which are indices 245, 246, 247
    if len(lines) > 248:
        # Verify line 247 has "return"
        if 'return' in lines[246]:
            new_lines = lines[:245] + lines[248:]
            with open(path, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            print("Successfully patched file.")
        else:
            print(f"Error: Line 247 content mismatch: {lines[246]}")
    else:
        print(f"Error: File too short ({len(lines)} lines)")
else:
    print(f"Error: Path not found: {path}")
