from .config import PROJECT_ROOT, MDX_COMMENT_START, MDX_COMMENT_END, HTML_COMMENT_START, HTML_COMMENT_END
import os
from termcolor import colored

def fix_mdx_syntax_in_file(file_path):
    """Fix MDX syntax in a single file"""
    print(colored(f"Checking MDX syntax in: {file_path}", "blue"))
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    needs_fixing = False
    
    # Check if file needs fixing
    if HTML_COMMENT_START in content:
        needs_fixing = True
        print(colored("Found HTML comments, converting to MDX...", "yellow"))
        
        # Convert HTML comments to MDX comments
        content = content.replace(HTML_COMMENT_START, MDX_COMMENT_START)
        content = content.replace(HTML_COMMENT_END, MDX_COMMENT_END)
        
        # Write fixed content
        with open(file_path, 'w') as f:
            f.write(content)
        print(colored("Fixed MDX syntax.", "green"))
    else:
        print(colored("MDX syntax is correct.", "green"))

def fix_all_templates():
    """Fix MDX syntax in all template files"""
    templates_fixed = 0
    
    print(colored("\nStarting MDX syntax fix...", "blue"))
    
    for root, dirs, files in os.walk(PROJECT_ROOT):
        for file in files:
            if file.startswith('TEMPLATE-') and file.endswith('.mdx'):
                file_path = os.path.join(root, file)
                fix_mdx_syntax_in_file(file_path)
                templates_fixed += 1
    
    print(colored(f"\nProcessed {templates_fixed} templates.", "blue"))

if __name__ == "__main__":
    fix_all_templates()