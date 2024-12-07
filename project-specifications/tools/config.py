import os

# Base paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS_DIR = os.path.join(PROJECT_ROOT, 'tools')
TEMPLATES_DIR = os.path.join(PROJECT_ROOT, '08-Resources', '01-Templates', 'Core_Templates')

# Template paths
BASE_TEMPLATE_PATH = os.path.join(TEMPLATES_DIR, 'base_template.mdx')

# Output paths
DEFAULT_OUTPUT_DIR = os.path.join(PROJECT_ROOT, 'output')

# Template patterns
MDX_COMMENT_START = '{/*'
MDX_COMMENT_END = '*/}'
HTML_COMMENT_START = '<!--'
HTML_COMMENT_END = '-->' 