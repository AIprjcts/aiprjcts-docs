from pathlib import Path
from termcolor import colored
from datetime import datetime
from ..config import Config
from ..validators import SpecValidator

class SpecGenerator:
    """Generates new specifications from templates"""
    def __init__(self):
        self.config = Config()
        self.validator = SpecValidator()

    def generate_spec(self, template_type, output_name):
        """Generate a new specification from template"""
        print(colored(f"Generating {template_type} specification: {output_name}", "blue"))
        
        # Get template path and output directory
        template_path = self.config.get_template_path(template_type)
        output_dir = self.config.get_output_dir(template_type)
        
        # Create output directory if it doesn't exist
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate output path
        output_path = output_dir / f"{output_name}.mdx"
        if output_path.exists():
            raise ValueError(f"Specification already exists: {output_path}")
        
        # Read template content
        with open(template_path) as f:
            content = f.read()
        
        # Replace placeholders
        content = self._replace_placeholders(content, template_type, output_name)
        
        # Write new specification
        with open(output_path, 'w') as f:
            f.write(content)
        
        print(colored(f"Created new specification: {output_path}", "green"))
        return output_path
    
    def _replace_placeholders(self, content, template_type, output_name):
        """Replace template placeholders with actual values"""
        # Get template info for ID generation
        template_info = self.config.get_template_info(template_type)
        id_prefix = template_info.get('id_prefix', '')
        
        # Generate timestamp
        timestamp = datetime.now().isoformat()
        
        # Replace common placeholders
        replacements = {
            '${ISO_TIMESTAMP}': timestamp,
            '${TEMPLATE_TYPE}': template_type,
            '${OUTPUT_NAME}': output_name,
            '${ID}': f"{id_prefix}{output_name}",
        }
        
        for key, value in replacements.items():
            content = content.replace(key, value)
        
        return content