export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'list' | 'date' | 'version';
  placeholder?: string;
  required?: boolean;
  listItems?: number; // For list type fields, number of items to collect
}

export interface TemplateSection {
  title: string;
  fields: TemplateField[];
}

export interface TemplateStructure {
  metadata: {
    documentType: string;
    parentTemplate?: string;
  };
  sections: TemplateSection[];
}

export interface TemplateVariable {
  key: string;
  value: string | string[];
} 