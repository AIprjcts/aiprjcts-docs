from .config import BASE_TEMPLATE_PATH, MDX_COMMENT_START, MDX_COMMENT_END
import os
from termcolor import colored
import re

class TemplateValidator:
    """Validates templates against base_template.mdx"""
    def __init__(self):
        self.base_template_path = BASE_TEMPLATE_PATH
        self.base_structure = self._parse_base_template()

    # ... rest of the validator code ... 