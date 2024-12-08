import click
from termcolor import colored
from pathlib import Path
from spectools.config.config import Config
from spectools.validators import TemplateValidator, SpecValidator
from spectools.generators.spec_generator import SpecGenerator

@click.group()
@click.pass_context
def cli(ctx):
    """Project Specifications CLI Tool"""
    print(colored("Initializing Project Specifications CLI...", "blue"))
    ctx.ensure_object(dict)
    ctx.obj['config'] = Config()

@cli.command()
@click.argument('template_type')
@click.argument('output_name')
@click.pass_context
def generate(ctx, template_type, output_name):
    """Generate a new specification from template"""
    print(colored(f"Generating {template_type} specification: {output_name}", "blue"))
    
    try:
        generator = SpecGenerator()
        output_path = generator.generate_spec(template_type, output_name)
        print(colored(f"Successfully generated specification at: {output_path}", "green"))
    except Exception as e:
        print(colored(f"Error generating specification: {str(e)}", "red"))
        raise click.Abort()

@cli.command()
@click.argument('template_path', type=click.Path(exists=True))
@click.pass_context
def validate_template(ctx, template_path):
    """Validate a template file"""
    print(colored(f"Validating template: {template_path}", "blue"))
    
    try:
        validator = TemplateValidator()
        errors, warnings = validator.validate_template(template_path)
        
        if warnings:
            print(colored("\nWarnings:", "yellow"))
            for warning in warnings:
                print(colored(f"- {warning}", "yellow"))
                
        if errors:
            print(colored("\nErrors:", "red"))
            for error in errors:
                print(colored(f"- {error}", "red"))
            raise click.Abort()
            
        print(colored("\nTemplate validation successful!", "green"))
    except Exception as e:
        print(colored(f"Error during template validation: {str(e)}", "red"))
        raise click.Abort()

@cli.command()
@click.argument('spec_path', type=click.Path(exists=True))
@click.pass_context
def validate_spec(ctx, spec_path):
    """Validate a specification file"""
    print(colored(f"Validating specification: {spec_path}", "blue"))
    
    try:
        validator = SpecValidator()
        errors, warnings = validator.validate_spec(spec_path)
        
        if warnings:
            print(colored("\nWarnings:", "yellow"))
            for warning in warnings:
                print(colored(f"- {warning}", "yellow"))
                
        if errors:
            print(colored("\nErrors:", "red"))
            for error in errors:
                print(colored(f"- {error}", "red"))
            raise click.Abort()
            
        print(colored("\nSpecification validation successful!", "green"))
    except Exception as e:
        print(colored(f"Error during specification validation: {str(e)}", "red"))
        raise click.Abort()

@cli.command()
@click.pass_context
def list_templates(ctx):
    """List available template types"""
    print(colored("Available template types:", "blue"))
    
    config = ctx.obj['config']
    for template_type, info in config.config['template_types'].items():
        template_path = config.get_template_path(template_type)
        output_dir = config.get_output_dir(template_type)
        print(colored(f"\nTemplate Type: {template_type}", "green"))
        print(colored(f"Template Path: {template_path}", "cyan"))
        print(colored(f"Output Directory: {output_dir}", "cyan"))

@cli.command()
@click.pass_context
def validate_all(ctx):
    """Validate all templates and specifications"""
    print(colored("Starting validation of all templates and specifications...", "blue"))
    
    config = ctx.obj['config']
    template_validator = TemplateValidator()
    spec_validator = SpecValidator()
    
    # Validate templates
    print(colored("\nValidating templates...", "blue"))
    for template_type, info in config.config['template_types'].items():
        template_path = config.get_template_path(template_type)
        if template_path.exists():
            print(colored(f"\nChecking template: {template_path}", "cyan"))
            errors, warnings = template_validator.validate_template(str(template_path))
            if errors or warnings:
                print(colored("Issues found!", "yellow"))
    
    # Validate specifications
    print(colored("\nValidating specifications...", "blue"))
    for template_type, info in config.config['template_types'].items():
        spec_dir = config.get_output_dir(template_type)
        if spec_dir.exists():
            for spec_file in spec_dir.glob("*.mdx"):
                print(colored(f"\nChecking specification: {spec_file}", "cyan"))
                errors, warnings = spec_validator.validate_spec(str(spec_file))
                if errors or warnings:
                    print(colored("Issues found!", "yellow"))

if __name__ == '__main__':
    cli(obj={}) 