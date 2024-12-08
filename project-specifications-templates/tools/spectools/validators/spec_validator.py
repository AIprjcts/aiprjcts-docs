from ..config import Config
from termcolor import colored
import re
from pathlib import Path

class SpecValidator:
    """Validates specifications against their templates"""
    def __init__(self):
        self.config = Config()

    def validate_spec(self, spec_path):
        """Validate a specification file"""
        print(colored(f"\nValidating specification: {spec_path}", "blue"))
        
        spec_path = Path(spec_path)
        if not spec_path.exists():
            return [f"Specification file not found: {spec_path}"], []
            
        with open(spec_path) as f:
            content = f.read()
            
        errors = []
        warnings = []
        
        # Determine template type from metadata
        template_type = self._get_template_type(content)
        if not template_type:
            errors.append("Could not determine template type from metadata")
            return errors, warnings
            
        # Get validation rules for this template type
        validation_rules = self.config.get_validation_rules(template_type)
        
        # Check required fields
        if 'required_fields' in validation_rules:
            for field in validation_rules['required_fields']:
                if not self._check_field_exists(content, field):
                    errors.append(f"Missing required field: {field}")
        
        # Validate ID format
        id_format = self.config.get_id_format(template_type)
        if id_format:
            if not self._validate_id_format(content, id_format):
                errors.append(f"Invalid ID format. Should match pattern: {id_format}")
        
        # Check relationships
        relationships = self.config.get_relationships(template_type)
        if relationships:
            relation_errors = self._validate_relationships(content, relationships)
            errors.extend(relation_errors)
        
        return errors, warnings
    
    def _get_template_type(self, content):
        """Extract template type from metadata"""
        match = re.search(r'type:\s*"([^"]+)"', content)
        if match:
            return match.group(1)
        return None
    
    def _check_field_exists(self, content, field):
        """Check if a field exists in the content"""
        # Simple check for field presence
        # Could be enhanced for more specific validation
        return bool(re.search(rf'{field}:', content))
    
    def _validate_id_format(self, content, id_format):
        """Validate ID against expected format"""
        match = re.search(r'id:\s*"([^"]+)"', content)
        if not match:
            return False
        id_value = match.group(1)
        return bool(re.match(id_format, id_value))
    
    def _validate_relationships(self, content, relationships):
        """Validate relationship references in content"""
        errors = []
        
        # Check 'contains' relationships
        if 'contains' in relationships:
            for item_type in relationships['contains']:
                if not re.search(rf'contains:\s*.*{item_type}', content, re.MULTILINE):
                    errors.append(f"Missing required containment relationship: {item_type}")
        
        # Check 'references' relationships
        if 'references' in relationships:
            for ref_type in relationships['references']:
                if not re.search(rf'references:\s*.*{ref_type}', content, re.MULTILINE):
                    warnings.append(f"Missing reference relationship: {ref_type}")
        
        return errors