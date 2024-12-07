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

def main():
    print(colored("Creating all specification templates...", "blue"))
    
    # Create directory structure
    create_directory_structure()
    
    # Complete template mappings
    template_mappings = {
        "03-Design_and_Architecture": {
            "01-System_Architecture": [
                ("architecture-overview", "System Architecture"),
                ("component-design", "System Architecture"),
                ("integration-patterns", "System Architecture")
            ],
            "02-Technical_Design": [
                ("technical-specifications", "Technical Design"),
                ("design-patterns", "Technical Design")
            ],
            "03-UI_UX_Design": [
                ("design-principles", "UI/UX Design"),
                ("interaction-patterns", "UI/UX Design"),
                ("style-guide", "UI/UX Design")
            ],
            "04-API_Design": [
                ("api-specifications", "API Design"),
                ("endpoint-documentation", "API Design")
            ],
            "05-Database_Design": [
                ("data-model", "Database Design"),
                ("schema-design", "Database Design")
            ]
        },
        "04-Development_Guidelines": {
            "01-Coding_Standards": [
                ("coding-conventions", "Development Guidelines"),
                ("best-practices", "Development Guidelines")
            ],
            "02-Review_Process": [
                ("code-review-checklist", "Development Guidelines"),
                ("pr-template", "Development Guidelines")
            ],
            "03-Testing_Standards": [
                ("test-strategy", "Development Guidelines"),
                ("test-cases", "Development Guidelines")
            ]
        },
        "05-Agile_Planning": {
            "01-Sprint_Planning": [
                ("sprint-goals", "Agile Planning"),
                ("sprint-backlog", "Agile Planning")
            ],
            "02-Release_Planning": [
                ("release-strategy", "Agile Planning"),
                ("deployment-plan", "Agile Planning")
            ],
            "03-Retrospectives": [
                ("retro-notes", "Agile Planning")
            ]
        }
    }
    
    # Create templates
    for base_dir, subdirs in template_mappings.items():
        for subdir, templates in subdirs.items():
            dir_path = os.path.join("project-specifications", base_dir, subdir)
            for template_name, category in templates:
                template_path = os.path.join(dir_path, f"TEMPLATE-{template_name}.mdx")
                content = get_template_content(template_name, category)
                create_template(template_path, content)

if __name__ == "__main__":
    main() 