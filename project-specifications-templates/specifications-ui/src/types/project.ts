export interface Project {
  id: string;
  name: string;
  description?: string;
  outputPath: string;
  createdAt: string;
  updatedAt: string;
  specifications: Specification[];
}

export interface Specification {
  id: string;
  name: string;
  templateId: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'review' | 'approved';
}

export interface ProjectConfig {
  name: string;
  description?: string;
  outputPath: string;
} 