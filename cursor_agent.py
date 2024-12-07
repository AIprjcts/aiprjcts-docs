from termcolor import colored
import os
import re
from datetime import datetime

class SpecificationAgent:
    def __init__(self):
        self.templates_path = "project-specifications"
        self.output_path = None
        self.domain_context = None
        
    def set_output_path(self, path):
        print(colored(f"Setting output path to: {path}", "blue"))
        self.output_path = path
        if not os.path.exists(path):
            os.makedirs(path)
            
    def set_domain_context(self, context):
        print(colored(f"Setting domain context: {context}", "blue"))
        self.domain_context = context

    def _load_template(self, template_path):
        """Load and validate template file"""
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")
        
        with open(template_path, 'r') as f:
            template = f.read()
        return template

    def _replace_placeholders(self, template, replacements):
        """Replace template placeholders with actual values"""
        for key, value in replacements.items():
            template = template.replace(f"${{{key}}}", str(value))
        return template

    def _save_specification(self, content, output_path):
        """Save specification to file"""
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            f.write(content)
        print(colored(f"Created specification: {output_path}", "green"))

    # Architecture and Design Methods
    def create_architecture_overview(self, arch_id, overview, components):
        print(colored(f"Creating architecture overview: {arch_id}", "green"))
        template_path = os.path.join(self.templates_path, 
                                   "03-Design_and_Architecture/01-System_Architecture/TEMPLATE-architecture-overview.mdx")
        replacements = {
            "ARCH_ID": arch_id,
            "HIGH_LEVEL_ARCHITECTURE": overview,
            "COMPONENTS": components,
            "CREATION_DATE": datetime.now().strftime("%Y-%m-%d"),
            "LAST_UPDATED_DATE": datetime.now().strftime("%Y-%m-%d"),
            "VERSION": "1.0"
        }
        self._create_specification(template_path, replacements, f"architecture/{arch_id}.mdx")

    def create_wireframe(self, wireframe_id, description, screens):
        print(colored(f"Creating wireframe: {wireframe_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "03-Design_and_Architecture/03-UI_UX_Design/TEMPLATE-wireframe-index.mdx")
        replacements = {
            "WIREFRAME_ID": wireframe_id,
            "DESCRIPTION": description,
            "SCREENS": screens
        }
        self._create_specification(template_path, replacements, f"wireframes/{wireframe_id}.mdx")

    def create_prototype(self, prototype_id, version, changes):
        print(colored(f"Creating prototype version: {prototype_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "03-Design_and_Architecture/03-UI_UX_Design/TEMPLATE-prototype-versions.mdx")
        replacements = {
            "PROTOTYPE_ID": prototype_id,
            "VERSION": version,
            "CHANGES": changes
        }
        self._create_specification(template_path, replacements, f"prototypes/{prototype_id}.mdx")

    def create_style_guide(self, guide_id, colors, typography, components):
        print(colored(f"Creating style guide: {guide_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "03-Design_and_Architecture/03-UI_UX_Design/TEMPLATE-style-guide.mdx")
        replacements = {
            "GUIDE_ID": guide_id,
            "COLORS": colors,
            "TYPOGRAPHY": typography,
            "COMPONENTS": components
        }
        self._create_specification(template_path, replacements, f"style-guide/{guide_id}.mdx")

    # Development Guidelines Methods
    def create_coding_standards(self, standards_id, language, conventions):
        print(colored(f"Creating coding standards: {standards_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "04-Development_Guidelines/01-Coding_Standards/TEMPLATE-coding-conventions.mdx")
        # Implementation details...

    def create_review_checklist(self, checklist_id, items):
        print(colored(f"Creating review checklist: {checklist_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "04-Development_Guidelines/02-Review_Process/TEMPLATE-code-review-checklist.mdx")
        # Implementation details...

    # Agile Planning Methods
    def create_sprint_plan(self, sprint_id, goals, stories):
        print(colored(f"Creating sprint plan: {sprint_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "05-Agile_Planning/01-Sprint_Planning/TEMPLATE-sprint-goals.mdx")
        # Implementation details...

    def create_release_plan(self, release_id, version, features):
        print(colored(f"Creating release plan: {release_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "05-Agile_Planning/02-Release_Planning/TEMPLATE-release-strategy.mdx")
        # Implementation details...

    # Technical Specifications Methods
    def create_database_schema(self, schema_id, entities, relationships):
        print(colored(f"Creating database schema: {schema_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "04-Development/02-Technical_Specifications/TEMPLATE-database-schema.mdx")
        replacements = {
            "SCHEMA_ID": schema_id,
            "ENTITIES": entities,
            "RELATIONSHIPS": relationships
        }
        self._create_specification(template_path, replacements, f"database/{schema_id}.mdx")

    def create_api_design(self, api_id, endpoints, auth_scheme):
        print(colored(f"Creating API design: {api_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "04-Development/02-Technical_Specifications/TEMPLATE-api-design.mdx")
        replacements = {
            "API_ID": api_id,
            "ENDPOINTS": endpoints,
            "AUTH_SCHEME": auth_scheme
        }
        self._create_specification(template_path, replacements, f"api/{api_id}.mdx")

    # Non-Functional Requirements Method
    def create_nfr(self, nfr_id, category, requirements):
        print(colored(f"Creating non-functional requirements: {nfr_id}", "green"))
        template_path = os.path.join(self.templates_path,
                                   "02-Requirements/05-Non_Functional_Requirements/TEMPLATE-Non-functional-requirements.mdx")
        replacements = {
            "NFR_ID": nfr_id,
            "CATEGORY": category,
            "REQUIREMENTS": requirements
        }
        self._create_specification(template_path, replacements, f"nfr/{nfr_id}.mdx")

    def _create_specification(self, template_path, replacements, output_filename):
        """Generic method to create a specification"""
        if not self.output_path:
            raise ValueError("Output path not set. Call set_output_path() first.")
        
        template = self._load_template(template_path)
        content = self._replace_placeholders(template, replacements)
        output_path = os.path.join(self.output_path, output_filename)
        self._save_specification(content, output_path)