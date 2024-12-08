import { TemplateField, TemplateSection, TemplateStructure } from '../types/template';

export class TemplateParser {
  static parseTemplate(content: string): TemplateStructure {
    const sections: TemplateSection[] = [];
    const metadata = {
      documentType: '',
      parentTemplate: undefined as string | undefined
    };

    try {
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        
        // Parse document type
        const titleMatch = frontmatter.match(/title:\s*(.+)/);
        if (titleMatch) {
          metadata.documentType = titleMatch[1].trim();
        }

        // Parse variables section
        const variablesMatch = frontmatter.match(/variables:([\s\S]*?)(?=\n\w|$)/);
        if (variablesMatch) {
          const variablesSection = variablesMatch[1];
          const fields: TemplateField[] = [];
          
          // Match each variable definition
          const variableMatches = variablesSection.matchAll(/(\w+):\s*\n\s+type:\s*(\w+)\s*\n\s+label:\s*(.+)\s*\n\s+description:\s*(.+)\s*\n\s+required:\s*(true|false)/g);
          
          for (const match of variableMatches) {
            fields.push({
              key: match[1],
              type: match[2] as 'text' | 'textarea' | 'list' | 'date' | 'version',
              label: match[3].trim(),
              placeholder: match[4].trim(),
              required: match[5] === 'true'
            });
          }

          if (fields.length > 0) {
            sections.push({
              title: 'Basic Information',
              fields
            });
          }
        }

        // Parse sections
        const sectionsMatch = frontmatter.match(/sections:([\s\S]*?)(?=\n\w|$)/);
        if (sectionsMatch) {
          const sectionsContent = sectionsMatch[1];
          const sectionMatches = sectionsContent.matchAll(/\s*-\s*title:\s*(.+)\n\s*fields:([\s\S]*?)(?=\s*-\s*title|\s*$)/g);

          for (const match of sectionMatches) {
            const sectionTitle = match[1].trim();
            const fieldsContent = match[2];
            const fields: TemplateField[] = [];

            const fieldMatches = fieldsContent.matchAll(/\s*-\s*(\w+)/g);
            for (const fieldMatch of fieldMatches) {
              const fieldKey = fieldMatch[1];
              fields.push({
                key: fieldKey,
                type: fieldKey.includes('DESCRIPTION') ? 'textarea' : 
                      fieldKey.includes('DATE') ? 'date' :
                      fieldKey.includes('LIST') ? 'list' :
                      'text',
                label: fieldKey.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' '),
                required: true
              });
            }

            if (fields.length > 0) {
              sections.push({
                title: sectionTitle,
                fields
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing template:', error);
    }

    return { metadata, sections };
  }
}

export const parseTemplateContent = (content: string): TemplateStructure => {
  return TemplateParser.parseTemplate(content);
}; 