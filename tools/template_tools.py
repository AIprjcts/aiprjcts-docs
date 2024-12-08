import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

class TemplateTools:
    def __init__(self, workspace_root: str):
        self.workspace_root = workspace_root
        self.templates_dir = os.path.join(workspace_root, 'project-specifications-templates')

    def list_templates(self) -> List[Dict[str, str]]:
        """List all available templates in the project."""
        templates = []
        for root, dirs, files in os.walk(self.templates_dir):
            # Skip the tools directory and any hidden directories
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'tools' and d != 'specifications-ui']
            
            for file in files:
                if file.startswith('TEMPLATE-') and file.endswith('.mdx'):
                    rel_path = os.path.relpath(os.path.join(root, file), self.templates_dir)
                    category_parts = os.path.dirname(rel_path).split(os.path.sep)
                    category = ' > '.join(part.replace('-', ' ').replace('_', ' ') for part in category_parts if part)
                    
                    # Read template metadata
                    with open(os.path.join(root, file), 'r') as f:
                        content = f.read()
                        name = self._extract_template_name(content) or self._format_template_name(file)
                        description = self._extract_template_description(content) or f"Template for {name}"

                    templates.append({
                        'id': rel_path,  # Using relative path as unique ID
                        'path': rel_path,
                        'name': name,
                        'category': category,
                        'description': description
                    })
        
        # Sort templates by category and name
        return sorted(templates, key=lambda x: (x['category'], x['name']))

    def _format_template_name(self, filename: str) -> str:
        """Format template filename into a readable name."""
        name = filename.replace('TEMPLATE-', '').replace('.mdx', '')
        name = name.replace('-', ' ').replace('_', ' ')
        return ' '.join(word.capitalize() for word in name.split())

    def _extract_template_name(self, content: str) -> Optional[str]:
        """Extract template name from content."""
        # First try to find a level 1 heading
        lines = content.split('\n')
        for line in lines:
            if line.startswith('# '):
                return line[2:].strip()
            
        # If no heading found, try to find it in the comment block
        if '<!--' in content and '-->' in content:
            comment = content[content.find('<!--')+4:content.find('-->')]
            for line in comment.split('\n'):
                line = line.strip()
                if line.upper().startswith('# TEMPLATE'):
                    return line.split('#')[1].replace('TEMPLATE', '').strip()
        return None

    def _extract_template_description(self, content: str) -> Optional[str]:
        """Extract template description from content."""
        if '<!--' in content and '-->' in content:
            comment = content[content.find('<!--')+4:content.find('-->')]
            lines = [line.strip() for line in comment.split('\n') if line.strip()]
            
            # Skip header lines and empty lines
            description_lines = []
            for line in lines:
                if not line.startswith('#') and not line.startswith('='):
                    description_lines.append(line)
                    if len(description_lines) == 2:  # Get up to 2 lines for description
                        break
            
            if description_lines:
                return ' '.join(description_lines)
        return None

    def read_template(self, template_path: str) -> str:
        """Read the content of a template file."""
        full_path = os.path.join(self.templates_dir, template_path)
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
        
        with open(full_path, 'r') as f:
            content = f.read()
            # Remove AI processing configuration section if present
            if 'AI Processing Configuration' in content:
                parts = content.split('## AI Processing Configuration')
                if len(parts) > 1:
                    next_section = parts[1].find('##')
                    if next_section != -1:
                        content = parts[0] + parts[1][next_section:]
                    else:
                        content = parts[0]
            return content

    def save_specification(self, template_path: str, content: str) -> str:
        """Save a generated specification and return the saved path."""
        # Create specifications directory if it doesn't exist
        specs_dir = os.path.join(self.workspace_root, 'generated-specifications')
        os.makedirs(specs_dir, exist_ok=True)

        # Generate specification filename
        template_name = os.path.basename(template_path).replace('TEMPLATE-', '').replace('.mdx', '')
        timestamp = self._generate_timestamp()
        spec_filename = f"{template_name}-{timestamp}.mdx"
        spec_path = os.path.join(specs_dir, spec_filename)

        with open(spec_path, 'w') as f:
            f.write(content)

        return os.path.relpath(spec_path, self.workspace_root)

    def _generate_timestamp(self) -> str:
        """Generate a timestamp for specification files."""
        from datetime import datetime
        return datetime.now().strftime('%Y%m%d-%H%M%S')

def register_tools(tools_registry):
    """Register template tools with Cursor."""
    template_tools = TemplateTools(tools_registry.workspace_root)

    @tools_registry.register('list_templates')
    def list_templates_command(args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            templates = template_tools.list_templates()
            return {'success': True, 'data': {'templates': templates}}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    @tools_registry.register('read_template')
    def read_template_command(args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            content = template_tools.read_template(args['path'])
            return {'success': True, 'data': {'content': content}}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    @tools_registry.register('save_specification')
    def save_specification_command(args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            saved_path = template_tools.save_specification(args['templatePath'], args['content'])
            return {'success': True, 'data': {'path': saved_path}}
        except Exception as e:
            return {'success': False, 'error': str(e)} 