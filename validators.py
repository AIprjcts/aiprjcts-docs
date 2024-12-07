import os
from termcolor import colored
import re
import yaml

class TemplateValidator:
    """Validates templates against base_template.mdx"""
    def __init__(self):
        self.base_template_path = "project-specifications/08-Resources/01-Templates/Core_Templates/base_template.mdx"
        self.base_structure = self._parse_base_template()
        self.example_specs_path = "zebra-project-specifications"

    def _parse_base_template(self):
        """Parse base template to extract structure and requirements"""
        with open(self.base_template_path, 'r') as f:
            content = f.read()
            
        # Extract required sections and structure
        structure = {
            'metadata': {
                'required_fields': ['id', 'category', 'type', 'version'],
                'location': 'start'
            },
            'ai_assistance': {
                'required_fields': [
                    'document_type',
                    'parent_template',
                    'prompt_refinement_checklist',
                    'base_prompt_structure'
                ],
                'location': 'after_metadata'
            },
            'content_sections': [
                'Document Identification',
                'Purpose and Scope',
                'Context',
                'Core Content',
                'Relationships and Dependencies',
                'Success Metrics',
                'Validation Criteria'
            ],
            'required_placeholders': [
                '${DOCUMENT_KEY}',
                '${DOCUMENT_TITLE}',
                '${VERSION}',
                '${STATUS}',
                '${AUTHOR}',
                '${LAST_UPDATED}'
            ]
        }
        return structure

    def _get_example_spec(self, spec_type):
        """Get example specification for comparison"""
        example_map = {
            'PER': '02-Requirements/01-User_Personas/PER-003-complex_care_condition.mdx',
            'ARCH': '03-Design_and_Architecture/01-System_Architecture/ARCH-001-system-overview.mdx',
            'US': '02-Requirements/02-User_Stories/US-001-user-authentication.mdx'
        }
        example_path = os.path.join(self.example_specs_path, example_map.get(spec_type, ''))
        if os.path.exists(example_path):
            with open(example_path, 'r') as f:
                return f.read()
        return None

    def verify_template(self, template_path):
        """Verify template follows base template structure and example specs"""
        with open(template_path, 'r') as f:
            content = f.read()
            
        errors = []
        
        # Check MDX syntax
        if not content.startswith('{/*'):
            errors.append("Template must start with MDX comment {/*")
            content = content.replace('<!--', '{/*').replace('-->', '*/}')
            
        # Get spec type from path
        spec_type = os.path.basename(template_path)[:3]
        example_content = self._get_example_spec(spec_type)
        
        if example_content:
            # Compare structure with example
            example_sections = re.findall(r'^##\s+(.+)$', example_content, re.MULTILINE)
            template_sections = re.findall(r'^##\s+(.+)$', content, re.MULTILINE)
            
            missing_sections = set(example_sections) - set(template_sections)
            if missing_sections:
                errors.append(f"Missing sections found in example: {', '.join(missing_sections)}")
            
            # Compare placeholders with example
            example_placeholders = set(re.findall(r'\${([^}]+)}', example_content))
            template_placeholders = set(re.findall(r'\${([^}]+)}', content))
            
            missing_placeholders = example_placeholders - template_placeholders
            if missing_placeholders:
                errors.append(f"Missing placeholders found in example: {', '.join(missing_placeholders)}")
        
        # Verify base template requirements
        for section in self.base_structure['content_sections']:
            if section not in content:
                errors.append(f"Missing required section from base template: {section}")
                
        return errors, content

class SpecificationValidator:
    """Validates specifications against their templates and examples"""
    def __init__(self):
        self.templates_path = "project-specifications"
        self.example_specs_path = "zebra-project-specifications"
        
    def _get_example_and_template(self, spec_type):
        """Get both example spec and template for validation"""
        template_map = {
            'PER': '02-Requirements/01-User_Personas/TEMPLATE-personas.mdx',
            'ARCH': '03-Design_and_Architecture/01-System_Architecture/TEMPLATE-architecture-overview.mdx',
            'US': '02-Requirements/02-User_Stories/TEMPLATE-story.mdx'
        }
        
        example_map = {
            'PER': '02-Requirements/01-User_Personas/PER-003-complex_care_condition.mdx',
            'ARCH': '03-Design_and_Architecture/01-System_Architecture/ARCH-001-system-overview.mdx',
            'US': '02-Requirements/02-User_Stories/US-001-user-authentication.mdx'
        }
        
        template_path = os.path.join(self.templates_path, template_map.get(spec_type, ''))
        example_path = os.path.join(self.example_specs_path, example_map.get(spec_type, ''))
        
        return template_path, example_path

    def verify_specification(self, spec_path):
        """Verify specification against template and example"""
        spec_type = os.path.basename(spec_path)[:3]
        template_path, example_path = self._get_example_and_template(spec_type)
        
        errors = []
        
        if not os.path.exists(template_path):
            errors.append(f"No template found for specification type: {spec_type}")
            return errors
            
        # Load all content
        with open(spec_path, 'r') as f:
            spec_content = f.read()
            
        with open(template_path, 'r') as f:
            template_content = f.read()
            
        if os.path.exists(example_path):
            with open(example_path, 'r') as f:
                example_content = f.read()
                
            # Compare with example structure
            example_sections = re.findall(r'^##\s+(.+)$', example_content, re.MULTILINE)
            spec_sections = re.findall(r'^##\s+(.+)$', spec_content, re.MULTILINE)
            
            missing_sections = set(example_sections) - set(spec_sections)
            if missing_sections:
                errors.append(f"Missing sections found in example: {', '.join(missing_sections)}")
        
        # Check template requirements
        template_sections = re.findall(r'^##\s+(.+)$', template_content, re.MULTILINE)
        for section in template_sections:
            if section not in spec_content:
                errors.append(f"Missing required section from template: {section}")
                
        # Check for unresolved placeholders
        unresolved = re.findall(r'\${([^}]+)}', spec_content)
        if unresolved:
            errors.append(f"Unresolved placeholders: {', '.join(unresolved)}")
            
        return errors

def verify_document(path, is_template=False):
    """Verify a document (template or specification)"""
    if is_template:
        validator = TemplateValidator()
        errors, fixed_content = validator.verify_template(path)
        
        # If MDX syntax was fixed, ask to update
        if '<!--' in fixed_content:
            print(colored("\nMDX syntax issues found and fixed.", "yellow"))
            response = input(colored("Update template with fixed MDX syntax? (y/N): ", "yellow"))
            if response.lower() == 'y':
                with open(path, 'w') as f:
                    f.write(fixed_content)
                print(colored("Template updated with fixed MDX syntax.", "green"))
    else:
        validator = SpecificationValidator()
        errors = validator.verify_specification(path)
        
    if errors:
        print(colored("\nValidation Errors:", "red"))
        for error in errors:
            print(colored(f"- {error}", "red"))
        
        response = input(colored("\nDocument has validation errors. Proceed anyway? (y/N): ", "yellow"))
        return response.lower() == 'y'
        
    return True 