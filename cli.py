import argparse
import json
import yaml
from termcolor import colored
from cursor_agent import SpecificationAgent
from pathlib import Path
import sys
from textwrap import dedent
import os
import click
from template_validator import verify_template_update

EXAMPLES = dedent("""
Examples:

1. DISCOVERY AND PLANNING
    # Create Vision Statement (alias: v)
    python cli.py vision --id VS-001 \\
        --exec-summary "Modern software development platform" \\
        --mission "Empower developers" \\
        --strategic-objectives "Improve productivity" "Enhance quality" \\
        --target-audience "Software teams" \\
        --value-props "Automated workflows" "Quality assurance" \\
        --success-metrics "User adoption" "Defect reduction"

    # Create Market Analysis (alias: m)
    python cli.py competitor --id CA-001 \\
        --direct-competitors "CompA:Market leader:High cost" "CompB:Innovative:Limited features" \\
        --indirect-competitors "AltSol:Different approach:Different market" \\
        --positioning "Premium developer tools" \\
        --opportunities "Cloud integration" "AI assistance"

    # Create Market Trends (alias: mt)
    python cli.py trends --id MT-001 \\
        --industry-overview "Developer tools market analysis" \\
        --emerging-tech "AI/ML" "Cloud-native" "Low-code" \\
        --consumer-trends "Remote development" "Automation focus" \\
        --market-size "50B USD" \\
        --regulations "Data privacy" "Security standards"

2. REQUIREMENTS
    # Create Epic (alias: e)
    python cli.py epic --id EPIC-001 \\
        --name "Authentication System" \\
        --description "Secure user authentication and authorization" \\
        --business-value "Enhanced security" \\
        --user-impact "Improved access control" \\
        --acceptance-criteria "SSO support" "2FA implementation"

    # Create Non-Functional Requirements (alias: nfr)
    python cli.py nfr --id NFR-001 \\
        --category performance \\
        --description "System response time requirements" \\
        --metrics "99th percentile < 200ms" "Average < 100ms" \\
        --constraints "Network latency" "Database performance"

3. DESIGN AND ARCHITECTURE
    # Create System Architecture (alias: arch)
    python cli.py architecture --id ARCH-001 \\
        --overview "Microservices architecture" \\
        --components "Auth Service" "User Service" "API Gateway" \\
        --patterns "Event-driven" "CQRS" \\
        --constraints "Cloud-native" "Containerized"

    # Create API Design (alias: api)
    python cli.py api --id API-001 \\
        --endpoints "/users:CRUD" "/auth:Authentication" \\
        --auth-scheme "JWT" \\
        --version "v1" \\
        --standards "REST" "OpenAPI 3.0"

4. DEVELOPMENT GUIDELINES
    # Create Coding Standards (alias: cs)
    python cli.py coding-standards --id CS-001 \\
        --language "Python" \\
        --conventions "PEP 8" "Type hints" \\
        --practices "Unit testing" "Documentation" "Code review"

    # Create Testing Standards (alias: ts)
    python cli.py test-standards --id TS-001 \\
        --test-types "Unit" "Integration" "E2E" \\
        --coverage "80% minimum" \\
        --tools "pytest" "selenium" "k6"

5. AGILE PLANNING
    # Create Sprint Planning (alias: sp)
    python cli.py sprint --id SP-001 \\
        --goals "Complete auth system" "API documentation" \\
        --stories "US-001" "US-002" "US-003" \\
        --capacity "40 story points" \\
        --dates "2024-03-01:2024-03-14"

    # Create Release Plan (alias: rel)
    python cli.py release --id REL-001 \\
        --version "1.0.0" \\
        --features "Authentication" "User Management" \\
        --date "2024-Q2" \\
        --dependencies "Database migration" "Security audit"

Configuration (specs-config.yaml):
    project_name: My Project
    output_dir: ./my-project-specs
    domain_context: Software Development
    templates_path: ./templates
    validation:
        strict: true
        auto_fix: false
    formatting:
        style: standard
        line_length: 80
    versioning:
        scheme: semver
        auto_increment: true
""")

def load_config():
    """Load configuration from YAML file"""
    config_paths = ['specs-config.yaml', 'specs-config.yml']
    for path in config_paths:
        if Path(path).exists():
            print(colored(f"Loading configuration from {path}", "blue"))
            with open(path, 'r') as f:
                return yaml.safe_load(f)
    return {}

def init_config(args):
    """Initialize configuration file"""
    config = {
        'project_name': args.name,
        'output_dir': args.output or './specifications',
        'domain_context': args.domain,
        'templates_path': args.templates or './project-specifications'
    }
    
    with open('specs-config.yaml', 'w') as f:
        yaml.dump(config, f, default_flow_style=False)
    print(colored("Created specs-config.yaml", "green"))

# Add command aliases
COMMAND_ALIASES = {
    'p': 'persona',
    's': 'story',
    'u': 'usecase',
    'm': 'market',
    'v': 'validate',
    'x': 'xref',
    'i': 'init'
}

def resolve_alias(command):
    """Resolve command aliases to full commands"""
    return COMMAND_ALIASES.get(command, command)

@click.group()
@click.option('--verify/--no-verify', default=True, help='Verify templates against base template')
def cli(verify):
    """Specification Generator CLI"""
    if verify:
        validator = TemplateValidator()
        print(colored("Template verification enabled", "blue"))

@cli.command()
@click.option('--force/--no-force', default=False, help='Force update without verification')
def update_templates(force):
    """Update existing templates"""
    if not force:
        validator = TemplateValidator()
        for root, dirs, files in os.walk("project-specifications"):
            for file in files:
                if file.endswith('.mdx'):
                    template_path = os.path.join(root, file)
                    if not verify_template_update(template_path):
                        continue
                    # Update template...

def main():
    # Add alias resolution
    if len(sys.argv) > 1:
        sys.argv[1] = resolve_alias(sys.argv[1])

    # Load configuration
    config = load_config()

    parser = argparse.ArgumentParser(
        description=colored('Specification Generator CLI - Create and manage project specifications', 'cyan'),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=EXAMPLES
    )

    # Main command arguments
    parser.add_argument('--output', '-o', 
                       help='Set output directory for generated specifications')
    parser.add_argument('--domain', '-d',
                       help='Set domain context for specifications')

    # Subcommands
    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Architecture and Design Commands
    arch_parser = subparsers.add_parser('architecture', help='Create architecture overview')
    arch_parser.add_argument('--id', required=True, help='Architecture ID')
    arch_parser.add_argument('--overview', required=True, help='High-level architecture overview')
    arch_parser.add_argument('--components', nargs='+', help='System components')

    ui_parser = subparsers.add_parser('ui-design', help='Create UI design principles')
    ui_parser.add_argument('--id', required=True, help='Design ID')
    ui_parser.add_argument('--principles', nargs='+', help='Design principles')
    ui_parser.add_argument('--patterns', nargs='+', help='Interaction patterns')

    # Development Guidelines Commands
    standards_parser = subparsers.add_parser('coding-standards', help='Create coding standards')
    standards_parser.add_argument('--id', required=True, help='Standards ID')
    standards_parser.add_argument('--language', required=True, help='Programming language')
    standards_parser.add_argument('--conventions', nargs='+', help='Coding conventions')

    review_parser = subparsers.add_parser('review-checklist', help='Create review checklist')
    review_parser.add_argument('--id', required=True, help='Checklist ID')
    review_parser.add_argument('--items', nargs='+', required=True, help='Checklist items')

    # Agile Planning Commands
    sprint_parser = subparsers.add_parser('sprint', help='Create sprint plan')
    sprint_parser.add_argument('--id', required=True, help='Sprint ID')
    sprint_parser.add_argument('--goals', nargs='+', required=True, help='Sprint goals')
    sprint_parser.add_argument('--stories', nargs='+', help='User stories')

    release_parser = subparsers.add_parser('release', help='Create release plan')
    release_parser.add_argument('--id', required=True, help='Release ID')
    release_parser.add_argument('--version', required=True, help='Release version')
    release_parser.add_argument('--features', nargs='+', help='Features included')

    # UI/UX Design Commands
    wireframe_parser = subparsers.add_parser('wireframe', help='Create wireframe index')
    wireframe_parser.add_argument('--id', required=True, help='Wireframe ID')
    wireframe_parser.add_argument('--description', required=True, help='Wireframe description')
    wireframe_parser.add_argument('--screens', nargs='+', help='Screen descriptions')

    prototype_parser = subparsers.add_parser('prototype', help='Create prototype version')
    prototype_parser.add_argument('--id', required=True, help='Prototype ID')
    prototype_parser.add_argument('--version', required=True, help='Version number')
    prototype_parser.add_argument('--changes', nargs='+', help='Changes in this version')

    style_parser = subparsers.add_parser('style', help='Create style guide')
    style_parser.add_argument('--id', required=True, help='Style Guide ID')
    style_parser.add_argument('--colors', nargs='+', help='Color definitions')
    style_parser.add_argument('--typography', nargs='+', help='Typography definitions')
    style_parser.add_argument('--components', nargs='+', help='Component definitions')

    # Technical Specification Commands
    db_parser = subparsers.add_parser('database', help='Create database schema')
    db_parser.add_argument('--id', required=True, help='Schema ID')
    db_parser.add_argument('--entities', nargs='+', required=True, help='Database entities')
    db_parser.add_argument('--relationships', nargs='+', help='Entity relationships')

    api_parser = subparsers.add_parser('api', help='Create API design')
    api_parser.add_argument('--id', required=True, help='API ID')
    api_parser.add_argument('--endpoints', nargs='+', required=True, help='API endpoints')
    api_parser.add_argument('--auth', help='Authentication scheme')

    # Non-Functional Requirements Command
    nfr_parser = subparsers.add_parser('nfr', help='Create non-functional requirements')
    nfr_parser.add_argument('--id', required=True, help='NFR ID')
    nfr_parser.add_argument('--category', required=True, 
                           choices=['performance', 'security', 'usability', 'reliability',
                                  'scalability', 'maintainability'])
    nfr_parser.add_argument('--requirements', nargs='+', required=True, help='Requirements list')

    args = parser.parse_args()

    # Initialize agent
    agent = SpecificationAgent()

    # Set output path and domain context if provided
    if args.output:
        agent.set_output_path(args.output)
    if args.domain:
        agent.set_domain_context(args.domain)

    # Process commands
    try:
        if args.command == 'architecture':
            agent.create_architecture_overview(args.id, args.overview, args.components)
        elif args.command == 'ui-design':
            agent.create_ui_design(args.id, args.principles, args.patterns)
        elif args.command == 'coding-standards':
            agent.create_coding_standards(args.id, args.language, args.conventions)
        elif args.command == 'review-checklist':
            agent.create_review_checklist(args.id, args.items)
        elif args.command == 'sprint':
            agent.create_sprint_plan(args.id, args.goals, args.stories)
        elif args.command == 'release':
            agent.create_release_plan(args.id, args.version, args.features)
        elif args.command == 'wireframe':
            agent.create_wireframe(args.id, args.description, args.screens)
        elif args.command == 'prototype':
            agent.create_prototype(args.id, args.version, args.changes)
        elif args.command == 'style':
            agent.create_style_guide(args.id, args.colors, args.typography, args.components)
        elif args.command == 'database':
            agent.create_database_schema(args.id, args.entities, args.relationships)
        elif args.command == 'api':
            agent.create_api_design(args.id, args.endpoints, args.auth)
        elif args.command == 'nfr':
            agent.create_nfr(args.id, args.category, args.requirements)
        else:
            parser.print_help()

    except Exception as e:
        print(colored(f"\nError: {str(e)}", "red"))

if __name__ == '__main__':
    main() 