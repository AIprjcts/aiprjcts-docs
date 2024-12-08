import os
import json
from pathlib import Path
from termcolor import colored

class Config:
    """Configuration manager for project specifications"""
    def __init__(self):
        print(colored("Initializing Config...", "blue"))
        self.config_dir = Path(__file__).parent
        self.project_root = self._find_project_root()
        print(colored(f"Project root: {self.project_root}", "cyan"))
        self.load_config()

    def _find_project_root(self):
        """Find the project root by looking for setup.py"""
        current_dir = Path.cwd()
        while not (current_dir / 'setup.py').exists():
            if current_dir.parent == current_dir:  # Reached root directory
                raise RuntimeError("Could not find project root (setup.py)")
            current_dir = current_dir.parent
        return current_dir

    def _resolve_path(self, path):
        """Resolve a path relative to project root, avoiding duplication"""
        path = Path(path)
        
        # Convert to string for easier manipulation
        path_str = str(path)
        root_str = str(self.project_root)
        
        # If the path already contains the project root, remove it
        if path_str.startswith(root_str):
            # Remove the project root and any leading slashes
            relative_path = path_str[len(root_str):].lstrip('/')
            return self.project_root / relative_path
        
        # If the path contains the project name, remove it
        project_name = self.project_root.name
        if project_name in path_str:
            parts = Path(path_str).parts
            try:
                # Find where the project name appears and take everything after it
                idx = parts.index(project_name)
                relative_path = Path(*parts[idx + 1:])
                return self.project_root / relative_path
            except ValueError:
                # If project name not found in path parts, use original path
                pass
        
        # If neither condition is met, just join with project root
        return self.project_root / path

    def load_config(self):
        """Load configuration from config.json"""
        config_path = self.config_dir / 'config.json'
        print(colored(f"Loading config from: {config_path}", "cyan"))
        
        if not config_path.exists():
            print(colored("Config file not found, creating default config...", "yellow"))
            self.create_default_config()
            
        with open(config_path) as f:
            self.config = json.load(f)
            
        # Resolve paths relative to project root
        self.templates_root = self.project_root
        self.output_root = self._resolve_path(self.config['paths']['output_root'])
        self.base_template = self._resolve_path(self.config['paths']['base_template'])
        
        print(colored(f"Base template path: {self.base_template}", "cyan"))
        if not self.base_template.exists():
            print(colored(f"Warning: Base template not found at: {self.base_template}", "yellow"))

    def create_default_config(self):
        """Create default configuration file"""
        default_config = {
            "paths": {
                "templates_root": ".",
                "output_root": "output",
                "base_template": "09-Resources/01-Templates/Core_Templates/base_template.mdx"
            },
            "template_types": {
                "sprint": {
                    "template": "05-Agile_Planning/01-Sprint_Planning/TEMPLATE-sprint-planning.mdx",
                    "output_dir": "sprints"
                },
                "architecture": {
                    "template": "03-Design_and_Architecture/01-System_Architecture/TEMPLATE-architecture-overview.mdx",
                    "output_dir": "architecture"
                },
                "persona": {
                    "template": "02-Requirements/01-User_Personas/TEMPLATE-persona.mdx",
                    "output_dir": "personas"
                },
                "schema": {
                    "template": "03-Design_and_Architecture/05-Database_Design/TEMPLATE-schema-design.mdx",
                    "output_dir": "database"
                }
            },
            "validation": {
                "mdx_syntax": {
                    "comment_start": "{/*"
                },
                "required_sections": [
                    "template:",
                    "metadata:",
                    "ai_assistance:"
                ]
            }
        }
        
        config_path = self.config_dir / 'config.json'
        with open(config_path, 'w') as f:
            json.dump(default_config, f, indent=2)
        print(colored(f"Created default config at: {config_path}", "green"))

    def get_template_path(self, template_type):
        """Get template path for given type"""
        if template_type not in self.config['template_types']:
            raise ValueError(f"Unknown template type: {template_type}")
            
        template_info = self.config['template_types'][template_type]
        path = self._resolve_path(template_info['template'])
        print(colored(f"Template path: {path}", "cyan"))
        if not path.exists():
            print(colored(f"Warning: Template not found at: {path}", "yellow"))
        return path

    def get_output_dir(self, template_type):
        """Get output directory for given type"""
        if template_type not in self.config['template_types']:
            raise ValueError(f"Unknown template type: {template_type}")
            
        template_info = self.config['template_types'][template_type]
        return self._resolve_path(self.config['paths']['output_root'] / template_info['output_dir'])

    def get_template_info(self, template_type):
        """Get all template information for given type"""
        if template_type not in self.config['template_types']:
            raise ValueError(f"Unknown template type: {template_type}")
        return self.config['template_types'][template_type]

    def get_id_format(self, template_type):
        """Get ID format for template type"""
        template_info = self.get_template_info(template_type)
        prefix = template_info.get('id_prefix', '')
        if prefix in self.config['validation']['id_formats']:
            return self.config['validation']['id_formats'][prefix]
        return None

    def get_relationships(self, template_type):
        """Get relationships for template type"""
        if template_type in self.config['relationships']:
            return self.config['relationships'][template_type]
        return {}

    def get_validation_rules(self, template_type):
        """Get validation rules for template type"""
        template_info = self.get_template_info(template_type)
        return template_info.get('validation_rules', {})