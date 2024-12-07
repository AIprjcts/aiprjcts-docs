import os
from termcolor import colored
import re

class TemplateValidator:
    def __init__(self):
        self.base_template_path = "project-specifications/08-Resources/01-Templates/Core_Templates/base_template.mdx"
        self.required_sections = [
            "Template Metadata",
            "AI-Assisted Template Development",
            "Document Metadata Configuration",
            "Research Methodology",
            "Validation Framework",
            "Continuous Improvement Process"
        ]
        
    def load_base_template(self):
        """Load base template content"""
        try:
            with open(self.base_template_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            raise Exception("Base template not found. Please ensure base_template.mdx exists.")

    def verify_template_structure(self, content):
        """Verify template follows base template structure"""
        errors = []
        
        # Check MDX syntax
        if not content.startswith('{/*'):
            errors.append("Template must start with MDX comment {/*")
        
        # Check required sections
        for section in self.required_sections:
            if section not in content:
                errors.append(f"Missing required section: {section}")
        
        # Check AI processing configuration
        if "ai_assistance:" not in content:
            errors.append("Missing AI assistance configuration")
        
        # Check document metadata
        if "metadata:" not in content:
            errors.append("Missing metadata configuration")
        
        return errors

    def verify_placeholders(self, content):
        """Verify template placeholders"""
        errors = []
        
        # Check for unclosed placeholders
        placeholders = re.findall(r'\${([^}]*)}', content)
        for placeholder in placeholders:
            if not placeholder.isupper():
                errors.append(f"Placeholder should be uppercase: ${{{placeholder}}}")
        
        # Check for required base placeholders
        required_placeholders = [
            "${ISO_TIMESTAMP}",
            "${DOCUMENT_KEY}",
            "${VERSION}",
            "${AUTHOR}",
            "${LAST_UPDATED_DATE}"
        ]
        
        for placeholder in required_placeholders:
            if placeholder not in content:
                errors.append(f"Missing required placeholder: {placeholder}")
        
        return errors

    def verify_template(self, template_path):
        """Verify template against base template"""
        try:
            with open(template_path, 'r') as f:
                content = f.read()
            
            structure_errors = self.verify_template_structure(content)
            placeholder_errors = self.verify_placeholders(content)
            
            return structure_errors + placeholder_errors
            
        except Exception as e:
            return [f"Error verifying template: {str(e)}"]

def verify_template_update(template_path):
    """Verify before updating existing template"""
    validator = TemplateValidator()
    
    print(colored(f"\nVerifying template: {template_path}", "blue"))
    errors = validator.verify_template(template_path)
    
    if errors:
        print(colored("Template validation errors:", "red"))
        for error in errors:
            print(colored(f"- {error}", "red"))
        
        # Ask for confirmation before updating
        response = input(colored("\nTemplate has validation errors. Update anyway? (y/N): ", "yellow"))
        return response.lower() == 'y'
    
    return True 