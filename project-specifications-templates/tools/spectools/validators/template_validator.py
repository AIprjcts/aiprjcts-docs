from ..config import Config
from termcolor import colored
import re
from pathlib import Path

class TemplateValidator:
    """Validates templates against base_template.mdx"""
    def __init__(self):
        self.config = Config()
        self.base_template = self._load_base_template()

    def _load_base_template(self):
        """Load and parse base template"""
        with open(self.config.base_template) as f:
            return f.read()

    def validate_template(self, template_path):
        """Validate a template against base template"""
        print(colored(f"\nValidating template: {template_path}", "blue"))
        
        with open(template_path) as f:
            content = f.read()
        
        errors = []
        warnings = []
        
        # Check required sections
        required_sections = ["template:", "metadata:", "ai_assistance:"]
        for section in required_sections:
            if section not in content:
                errors.append(f"Missing required section: {section}")
        
        # Check metadata structure
        if not re.search(r'template:\s*\n\s+id:', content):
            errors.append("Invalid metadata structure")
        
        # Check template type
        if not re.search(r'type:\s*"[^"]+"', content):
            errors.append("Missing or invalid template type")
        
        # Check AI assistance section
        if not re.search(r'ai_assistance:\s*\n', content):
            errors.append("Missing AI assistance section")
        
        return errors, warnings 