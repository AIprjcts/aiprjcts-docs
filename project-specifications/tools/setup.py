import os
from termcolor import colored
import shutil

def setup_tools_directory():
    """Set up tools directory and move scripts"""
    # Create tools directory if it doesn't exist
    tools_dir = "project-specifications/tools"
    os.makedirs(tools_dir, exist_ok=True)
    
    # List of scripts to move
    scripts = [
        'cli.py',
        'cursor_agent.py',
        'create_templates.py',
        'fix_mdx_syntax.py',
        'validators.py',
        'test_templates.py'
    ]
    
    # Create __init__.py
    with open(os.path.join(tools_dir, '__init__.py'), 'w') as f:
        f.write('# Tools package for project specifications\n')
    
    # Move scripts to tools directory
    for script in scripts:
        if os.path.exists(script):
            shutil.move(script, os.path.join(tools_dir, script))
            print(colored(f"Moved {script} to tools directory", "green"))
    
    print(colored("\nTools directory setup complete!", "green"))

if __name__ == "__main__":
    setup_tools_directory() 