#!/bin/bash

# Description: This script creates the necessary folders and template .mdx files 
# in the 00-templates directory based on the provided project structure.

# Define the base directory
BASE_DIR="project-specifications/00-project-templates/00-templates"

# Declare an associative array where the key is the directory path and the value is the list of subdirectories
declare -A DIRECTORY_STRUCTURE=(
    ["requirements/core"]="project-overview objectives stakeholders scope"
    ["requirements/personas-roles"]="personas roles-and-responsibilities"
    ["requirements/glossary"]="definitions acronyms"
    ["requirements/user-stories"]="user-stories"
    ["requirements/use-cases"]="diagrams descriptions"
    ["requirements/functional"]="requirements"
    ["requirements/non-functional"]="performance security usability compliance"
    ["requirements/technical"]="stack integration hardware"
    ["design/architecture"]="system diagrams"
    ["design/database"]="er-diagrams schema"
    ["design/api"]="specifications documentation"
    ["design/ui-ux"]="wireframes mockups style-guide"
    ["design/security"]="threat-modeling protocols"
    ["development/environment"]="setup build"
    ["development/source-code"]="source-code"
    ["development/guidelines"]="coding-standards version-control"
    ["development/scripts"]="automation tools"
    ["testing/strategy"]="plan approach"
    ["testing/cases"]="unit integration system"
    ["testing/reports"]="results bugs"
    ["testing/data"]="sets"
)

# Function to create directories and .mdx files
create_directories_and_files() {
    for DIR in "${!DIRECTORY_STRUCTURE[@]}"; do
        # Split the subdirectories
        IFS=' ' read -r -a SUBDIRS <<< "${DIRECTORY_STRUCTURE[$DIR]}"

        for SUB in "${SUBDIRS[@]}"; do
            FULL_DIR="$BASE_DIR/$DIR/$SUB"
            mkdir -p "$FULL_DIR"
            echo "Created directory: $FULL_DIR"

            # Determine the template file name based on the subdirectory name
            TEMPLATE_NAME="${SUB}_template.mdx"
            TEMPLATE_FILE="$FULL_DIR/$TEMPLATE_NAME"

            # Create the .mdx file with initial content
            cat <<EOL > "$TEMPLATE_FILE"
---
# Template Metadata
template:
  id: "${SUB}"
  version: "1.0"
  category: "documentation"
  type: "${SUB}"
  
# Document Metadata
metadata:
  must:
    title: "\${TITLE}"
    version: "\${VERSION}"
    author: "\${AUTHOR}"
  should:
    description: "\${DESCRIPTION}"
    date_created: "\${DATE_CREATED}"
  could:
    last_updated: "\${LAST_UPDATED}"
    tags: "\${TAGS}"
  won't:
    deprecatedField: null

# AI Instructions
ai:
  documentType: "${SUB}"
  validationRules:
    mustSections: ["introduction", "requirements"]
    shouldSections: ["design", "testing"]
    couldSections: ["deployment", "maintenance"]
    won'tSections: ["deprecated_section"]
  promptTemplates:
    creation: |
      "Generate a comprehensive ${SUB} document focusing on {topic}..."
    enhancement: |
      "Enhance the ${SUB} {template_id} by adding details about {aspect}..."
---

<!-- 
TEMPLATE USAGE:
1. Replace all \${PLACEHOLDER} markers with actual content.
2. Remove all template comments and instructions.
3. Validate against the schema defined in metadata.
4. Update document metadata with actual values.

Pattern to Follow:
- Maintain clarity and consistency across all sections.
- Ensure all required sections are thoroughly detailed.
- Use specific and actionable language for requirements.
-->

## Introduction
<!-- AI-VALIDATION: Introduction must provide a clear overview of the document's purpose and scope. -->
\${INTRODUCTION}

**Example:**
> "This document outlines the requirements and objectives for the [${SUB}] project, ensuring all stakeholders are aligned."

<!-- 
AI-CONTEXT: Introduction Section
Purpose: Provide a clear and concise overview of the document.
Guidelines:
- State the purpose and scope.
- Outline the main objectives.
- Mention any key stakeholders or audiences.
 -->


---
EOL

            echo "Created file: $TEMPLATE_FILE"
        done
    done
}

# Execute the function
create_directories_and_files

echo "All template folders and .mdx files have been created successfully."