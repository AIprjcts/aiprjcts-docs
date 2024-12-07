import os
from termcolor import colored

def fix_mdx_syntax(file_path):
    """Fix MDX syntax in existing template"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    needs_fixing = False
    
    # Check if file needs fixing
    if (content.startswith('<!--') or 
        '<!--' in content or 
        '-->' in content or 
        content.count('{/*') != content.count('*/}')):
        needs_fixing = True
        print(colored(f"Fixing MDX syntax in: {file_path}", "yellow"))
        
        # Fix HTML-style comments
        if '<!--' in content:
            # Handle multi-line comments
            lines = content.split('\n')
            in_comment = False
            fixed_lines = []
            
            for line in lines:
                if line.strip().startswith('<!--'):
                    line = line.replace('<!--', '{/*')
                    in_comment = True
                if line.strip().endswith('-->'):
                    line = line.replace('-->', '*/}')
                    in_comment = False
                fixed_lines.append(line)
            
            content = '\n'.join(fixed_lines)
        
        # Fix any remaining HTML comments
        content = content.replace('<!--', '{/*')
        content = content.replace('-->', '*/}')
        
        # Ensure proper comment closure
        if content.count('{/*') > content.count('*/}'):
            content += '\n*/}'
        
        # Write fixed content
        with open(file_path, 'w') as f:
            f.write(content)
        
        if needs_fixing:
            print(colored(f"Fixed MDX syntax in: {file_path}", "green"))
        else:
            print(colored(f"No fixes needed in: {file_path}", "blue"))

def fix_all_templates():
    """Fix MDX syntax in all existing templates"""
    print(colored("\nScanning for MDX syntax issues...", "blue"))
    
    # Track statistics
    fixed_count = 0
    error_count = 0
    
    for root, dirs, files in os.walk("project-specifications"):
        for file in files:
            if file.endswith('.mdx'):
                try:
                    file_path = os.path.join(root, file)
                    before_fix = open(file_path, 'r').read()
                    fix_mdx_syntax(file_path)
                    after_fix = open(file_path, 'r').read()
                    
                    if before_fix != after_fix:
                        fixed_count += 1
                except Exception as e:
                    print(colored(f"Error fixing {file}: {str(e)}", "red"))
                    error_count += 1
    
    # Print summary
    print(colored("\nMDX Syntax Fix Summary:", "blue"))
    print(colored(f"Files fixed: {fixed_count}", "green"))
    if error_count > 0:
        print(colored(f"Errors encountered: {error_count}", "red"))

def main():
    fix_all_templates()

if __name__ == "__main__":
    main() 