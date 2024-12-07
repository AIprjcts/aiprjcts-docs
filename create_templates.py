import os
from termcolor import colored

def create_directory_structure():
    print(colored("Creating directory structure...", "blue"))
    base_dirs = [
        "03-Design_and_Architecture",
        "04-Development_Guidelines",
        "05-Agile_Planning"
    ]
    
    subdirs = {
        "03-Design_and_Architecture": [
            "01-System_Architecture",
            "02-Technical_Design",
            "03-UI_UX_Design",
            "04-API_Design",
            "05-Database_Design"
        ],
        "04-Development_Guidelines": [
            "01-Coding_Standards",
            "02-Review_Process",
            "03-Testing_Standards"
        ],
        "05-Agile_Planning": [
            "01-Sprint_Planning",
            "02-Release_Planning",
            "03-Retrospectives"
        ]
    }
    
    for base_dir in base_dirs:
        base_path = os.path.join("project-specifications", base_dir)
        for subdir in subdirs[base_dir]:
            dir_path = os.path.join(base_path, subdir)
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)
                print(colored(f"Created directory: {dir_path}", "green"))

def verify_mdx_syntax(content):
    """Verify MDX syntax in template content"""
    errors = []
    
    # Check for HTML comments
    if '<!--' in content or '-->' in content:
        errors.append("Found HTML comments. Use MDX comments {/* */} instead")
    
    # Check for unclosed MDX comments
    if content.count('{/*') != content.count('*/}'):
        errors.append("Mismatched MDX comment brackets")
    
    # Check for proper MDX frontmatter
    if not content.startswith('{/*'):
        errors.append("Template should start with MDX comment")
    
    return errors

def create_template(path, content):
    print(colored(f"Creating template: {path}", "blue"))
    
    # Verify MDX syntax
    errors = verify_mdx_syntax(content)
    if errors:
        print(colored("MDX Syntax Errors:", "red"))
        for error in errors:
            print(colored(f"- {error}", "red"))
        return False
    
    with open(path, 'w') as f:
        f.write(content)
    print(colored(f"Created template: {path}", "green"))
    return True

def get_base_template(template_name, category):
    """Generate base template with correct MDX syntax"""
    return f'''{{/* 
###########################################################################################################
# {template_name}
# Inherits from base_template
# Type: {category}
###########################################################################################################
*/}}

# Template Metadata
template:
  id: "{template_name.lower().replace(' ', '-')}"
  category: "{category.lower()}"
  type: "{template_name.lower().replace(' ', '-')}"
  version: "1.0"

metadata:
  author: "AIprjcts"
  status: "Active"
  last_updated: "${{ISO_TIMESTAMP}}"

## AI-Assisted Template Development
ai_assistance:
  document_type: "{template_name.lower().replace(' ', '_')}"
  parent_template: "base_template"
'''

def get_template_content(template_name, category):
    """Get specific content for each template type"""
    base = get_base_template(template_name, category)
    
    template_specific_content = {
        # System Architecture Templates
        "architecture-overview": '''
## Architecture Overview Content
### 1. Document Identification
| Attribute | Details | Status |
|-----------|---------|---------|
| **Document ID** | ${ARCH_ID} | ${STATUS} |
| **System Name** | ${SYSTEM_NAME} | ${SYSTEM_STATUS} |

### 2. System Architecture Overview
(User Provided) ${HIGH_LEVEL_ARCHITECTURE}

### 3. Key Components
(User Provided)
- ${COMPONENT_1}
- ${COMPONENT_2}
- ${COMPONENT_3}
''',
        "component-design": '''
## Component Design
### 1. Component Overview
(User Provided) ${COMPONENT_OVERVIEW}

### 2. Component Responsibilities
(User Provided)
- ${RESPONSIBILITY_1}
- ${RESPONSIBILITY_2}

### 3. Interfaces
(User Provided)
| Interface | Type | Purpose |
|-----------|------|---------|
| ${INTERFACE_1} | ${TYPE_1} | ${PURPOSE_1} |
''',
        # Add more template-specific content here...
    }
    
    return base + template_specific_content.get(template_name, '')

def verify_and_create_templates():
    """Verify existing templates and only create missing ones"""
    print(colored("Verifying templates structure...", "blue"))
    
    # Define expected structure
    expected_templates = {
        "03-Design_and_Architecture": {
            "01-System_Architecture": [
                "TEMPLATE-architecture-overview.mdx",
                "TEMPLATE-component-design.mdx",
                "TEMPLATE-integration-patterns.mdx"
            ],
            # ... other directories
        },
        "04-Development_Guidelines": {
            "01-Coding_Standards": [
                "TEMPLATE-coding-conventions.mdx",
                "TEMPLATE-best-practices.mdx"
            ],
            # ... other directories
        },
        "05-Agile_Planning": {
            "01-Sprint_Planning": [
                "TEMPLATE-sprint-goals.mdx",
                "TEMPLATE-sprint-backlog.mdx"
            ],
            # ... other directories
        }
    }
    
    # Check and create only missing templates
    for base_dir, subdirs in expected_templates.items():
        base_path = os.path.join("project-specifications", base_dir)
        
        for subdir, templates in subdirs.items():
            dir_path = os.path.join(base_path, subdir)
            
            # Create directory if it doesn't exist
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)
                print(colored(f"Created directory: {dir_path}", "green"))
            
            # Check each template
            for template in templates:
                template_path = os.path.join(dir_path, template)
                if not os.path.exists(template_path):
                    print(colored(f"Creating missing template: {template_path}", "yellow"))
                    content = get_template_content(template, base_dir)
                    create_template(template_path, content)
                else:
                    print(colored(f"Template exists: {template_path}", "blue"))

def main():
    verify_and_create_templates()

if __name__ == "__main__":
    main() 