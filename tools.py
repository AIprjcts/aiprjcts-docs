import os
import sys
from pathlib import Path

def register(tools_registry):
    """Register all tools with Cursor."""
    try:
        # Add the tools directory to Python path
        workspace_root = os.path.dirname(os.path.abspath(__file__))
        tools_dir = os.path.join(workspace_root, 'tools')
        if tools_dir not in sys.path:
            sys.path.append(tools_dir)
            print(f"Added tools directory to Python path: {tools_dir}")

        # Set workspace root in registry
        tools_registry.workspace_root = workspace_root
        print(f"Set workspace root to: {workspace_root}")

        # Import and register template tools
        try:
            from tools.template_tools import register_tools
            print("Successfully imported template tools")
        except ImportError as e:
            print(f"Error importing template tools: {str(e)}")
            # Try alternative import
            from tools.template_tools import register_tools
            print("Successfully imported template tools (alternative path)")

        # Register the tools
        register_tools(tools_registry)
        print("Successfully registered template tools with Cursor")
        return True
    except Exception as e:
        print(f"Error registering tools: {str(e)}")
        print(f"Python path: {sys.path}")
        print(f"Current directory: {os.getcwd()}")
        print(f"Directory contents: {os.listdir(workspace_root)}")
        return False 