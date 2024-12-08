import os
import sys
from pathlib import Path

def register(tools_registry):
    """Register all tools with Cursor."""
    try:
        # Add the tools directory to Python path
        tools_dir = os.path.join(os.path.dirname(__file__), 'tools')
        if tools_dir not in sys.path:
            sys.path.append(tools_dir)
            print(f"Added tools directory to Python path: {tools_dir}")

        # Import and register template tools
        try:
            from tools import register_tools
            print("Successfully imported template tools")
        except ImportError as e:
            print(f"Error importing template tools: {str(e)}")
            # Try alternative import
            from template_tools import register_tools
            print("Successfully imported template tools (alternative path)")

        # Register the tools
        register_tools(tools_registry)
        print("Successfully registered template tools with Cursor")
        return True
    except Exception as e:
        print(f"Error registering tools: {str(e)}")
        print(f"Python path: {sys.path}")
        return False 