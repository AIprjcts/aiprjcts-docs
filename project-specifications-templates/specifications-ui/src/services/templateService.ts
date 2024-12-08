import { Template } from '../components/TemplateSelector';
import { Project } from '../types/project';

interface CursorResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface CursorCommandArgs {
  directory?: string;
  path?: string;
  templatePath?: string;
  content?: string;
  variables?: Record<string, string | string[]>;
  outputPath?: string;
  project?: Project;
}

interface TemplateData extends Template {
  path: string;
}

interface TemplateListResponse {
  templates: TemplateData[];
}

interface TemplateContentResponse {
  content: string;
}

class TemplateService {
  private static instance: TemplateService;
  private cursorAvailable: boolean = false;
  private cursorChecked: boolean = false;
  private checkPromise: Promise<void> | null = null;
  private offlineMode: boolean = false;

  private constructor() {
    this.checkCursorAvailability();
  }

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  private async checkCursorAvailability(): Promise<void> {
    if (this.checkPromise) {
      return this.checkPromise;
    }

    this.checkPromise = new Promise((resolve) => {
      console.log('Checking Cursor availability at http://localhost:8765...');
      
      fetch('http://localhost:8765/cursor/available', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
        .then(response => {
          this.cursorAvailable = response.ok;
          if (!response.ok) {
            this.enableOfflineMode();
          }
          this.cursorChecked = true;
          resolve();
        })
        .catch(error => {
          console.error('Error connecting to Cursor server:', error);
          this.cursorAvailable = false;
          this.enableOfflineMode();
          this.cursorChecked = true;
          resolve();
        });
    });

    return this.checkPromise;
  }

  private enableOfflineMode() {
    this.offlineMode = true;
    console.log('Switched to offline mode with mock data');
  }

  private async callCursor<T>(command: string, args: CursorCommandArgs = {}): Promise<CursorResponse<T>> {
    if (!this.cursorAvailable) {
      throw new Error('Cursor is not available');
    }

    const response = await fetch('http://localhost:8765/cursor/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        command,
        args,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to execute command: ${response.statusText}`);
    }

    return response.json();
  }

  public isOfflineMode(): boolean {
    return this.offlineMode;
  }

  private sortTemplates(templates: Template[]): Template[] {
    return templates.sort((a, b) => {
      // Extract folder numbers from paths (e.g., "01-Discovery" -> 1)
      const getNumber = (path: string): number => {
        const match = path.match(/^(\d+)-/);
        return match ? parseInt(match[1], 10) : 999;
      };

      // Get main category numbers
      const aMainNum = getNumber(a.path.split('/')[0]);
      const bMainNum = getNumber(b.path.split('/')[0]);

      if (aMainNum !== bMainNum) {
        return aMainNum - bMainNum;
      }

      // If main categories are the same, check subcategories
      const aSubNum = getNumber(a.path.split('/')[1] || '');
      const bSubNum = getNumber(b.path.split('/')[1] || '');

      if (aSubNum !== bSubNum) {
        return aSubNum - bSubNum;
      }

      // If subcategories are the same, sort by name
      return a.name.localeCompare(b.name);
    });
  }

  public async loadTemplates(): Promise<Template[]> {
    await this.checkCursorAvailability();
    
    if (this.offlineMode) {
      return this.sortTemplates(this.getMockTemplates());
    }

    try {
      const response = await this.callCursor<TemplateListResponse>('list_templates');
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load templates');
      }
      return this.sortTemplates(response.data.templates);
    } catch (error) {
      console.error('Error loading templates:', error);
      this.enableOfflineMode();
      return this.sortTemplates(this.getMockTemplates());
    }
  }

  public async createNewProject(name: string): Promise<void> {
    if (this.offlineMode) {
      console.log('Creating new project in offline mode:', name);
      return Promise.resolve();
    }

    try {
      const response = await this.callCursor('create_project', { 
        project: { 
          id: 'mock-project', 
          name, 
          outputPath: '', 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString(), 
          specifications: [] 
        } 
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  public async openProject(): Promise<void> {
    if (this.offlineMode) {
      console.log('Opening project in offline mode');
      return Promise.resolve();
    }

    try {
      const response = await this.callCursor<{ project: Project }>('load_project', { path: '' });
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load project');
      }
    } catch (error) {
      console.error('Error opening project:', error);
      throw error;
    }
  }

  public async updateProject(project: Project): Promise<void> {
    if (this.offlineMode) {
      console.log('Updating project in offline mode:', project);
      return Promise.resolve();
    }

    try {
      const response = await this.callCursor('update_project', { project });
      if (!response.success) {
        throw new Error(response.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  public async generateSpecification(
    templatePath: string,
    variables: Record<string, string | string[]>,
    outputPath: string
  ): Promise<string> {
    if (this.offlineMode) {
      const content = await this.loadTemplateContent(templatePath);
      
      // Replace variables in the content
      let generatedContent = content.replace(/\${(\w+)}/g, (match: string, variable: string) => {
        const value = variables[variable];
        return value ? (Array.isArray(value) ? value.join(', ') : value) : match;
      });

      // Remove the frontmatter
      generatedContent = generatedContent.replace(/---[\s\S]*?---\n\n/, '');

      return generatedContent;
    }

    try {
      const response = await this.callCursor<{ content: string }>('generate_specification', {
        templatePath,
        variables,
        outputPath,
      });
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate specification');
      }
      return response.data.content;
    } catch (error) {
      console.error('Error generating specification:', error);
      this.enableOfflineMode();
      return this.generateSpecification(templatePath, variables, outputPath);
    }
  }

  public async saveSpecification(path: string, content: string): Promise<void> {
    if (this.offlineMode) {
      console.log('Saving specification in offline mode:', { path, content });
      return Promise.resolve();
    }

    try {
      const response = await this.callCursor('save_specification', { path, content });
      if (!response.success) {
        throw new Error(response.error || 'Failed to save specification');
      }
    } catch (error) {
      console.error('Error saving specification:', error);
      throw error;
    }
  }

  public async loadTemplateContent(templatePath: string): Promise<string> {
    if (this.offlineMode) {
      const templateName = templatePath.split('/').pop()?.replace('.mdx', '').replace('TEMPLATE-', '') || 'Unknown';
      const category = templatePath.split('/')[0].replace(/^\d+-/, '').replace(/_/g, ' ');
      
      return `---
title: ${templateName}
description: Template for creating ${templateName.toLowerCase()} documentation
category: ${category}
variables:
  PROJECT_NAME:
    type: text
    label: Project Name
    description: The name of your project
    required: true
  DESCRIPTION:
    type: textarea
    label: Description
    description: A brief description of your project
    required: true
  AUTHOR:
    type: text
    label: Author
    description: Your name or team name
    required: true
  DATE:
    type: date
    label: Date
    description: The current date
    required: true
  STAKEHOLDERS:
    type: list
    label: Stakeholders
    description: List of project stakeholders
    required: false
  OBJECTIVES:
    type: textarea
    label: Objectives
    description: The main objectives of this ${templateName.toLowerCase()}
    required: true
  SCOPE:
    type: textarea
    label: Scope
    description: The scope of this ${templateName.toLowerCase()}
    required: true
  DELIVERABLES:
    type: list
    label: Deliverables
    description: List of deliverables
    required: true
sections:
  - title: Overview
    fields:
      - PROJECT_NAME
      - DESCRIPTION
      - AUTHOR
      - DATE
  - title: Team
    fields:
      - STAKEHOLDERS
  - title: Details
    fields:
      - OBJECTIVES
      - SCOPE
      - DELIVERABLES
---

# \${PROJECT_NAME}

## Overview
\${DESCRIPTION}

**Author:** \${AUTHOR}
**Date:** \${DATE}

## Team
**Stakeholders:** \${STAKEHOLDERS}

## Details
### Objectives
\${OBJECTIVES}

### Scope
\${SCOPE}

### Deliverables
\${DELIVERABLES}
`;
    }

    try {
      const response = await this.callCursor<TemplateContentResponse>('load_template_content', {
        path: templatePath
      });
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load template content');
      }
      return response.data.content;
    } catch (error) {
      console.error('Error loading template content:', error);
      this.enableOfflineMode();
      return this.loadTemplateContent(templatePath);
    }
  }

  public async deleteSpecification(path: string): Promise<void> {
    if (this.offlineMode) {
      console.log('Deleting specification in offline mode:', path);
      return Promise.resolve();
    }

    try {
      const response = await this.callCursor('delete_specification', { path });
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete specification');
      }
    } catch (error) {
      console.error('Error deleting specification:', error);
      throw error;
    }
  }

  private getMockTemplates(): Template[] {
    return [
      // 01-Discovery_and_Planning
      {
        id: 'vision-statement',
        name: 'Vision Statement',
        category: '01-Discovery and Planning > 01-Vision and Scope',
        description: 'Template for creating project vision statements and defining the overall direction',
        path: '01-Discovery_and_Planning/01-Vision_and_Scope/TEMPLATE-vision-statement.mdx'
      },
      {
        id: 'product-goals',
        name: 'Product Goals',
        category: '01-Discovery and Planning > 01-Vision and Scope',
        description: 'Template for defining product goals and objectives',
        path: '01-Discovery_and_Planning/01-Vision_and_Scope/TEMPLATE-product-goals.mdx'
      },
      {
        id: 'market-trends',
        name: 'Market Trends Analysis',
        category: '01-Discovery and Planning > 02-Market Research',
        description: 'Template for analyzing market trends and industry patterns',
        path: '01-Discovery_and_Planning/02-Market_Research/TEMPLATE-market-trends.mdx'
      },
      {
        id: 'competitor-analysis',
        name: 'Competitor Analysis',
        category: '01-Discovery and Planning > 02-Market Research',
        description: 'Template for analyzing competitors and market positioning',
        path: '01-Discovery_and_Planning/02-Market_Research/TEMPLATE-competitor-analysis.mdx'
      },
      {
        id: 'product-roadmap',
        name: 'Product Roadmap',
        category: '01-Discovery and Planning > 03-Product Strategy',
        description: 'Template for product roadmap and strategic planning',
        path: '01-Discovery_and_Planning/03-Product_Strategy/TEMPLATE-product-roadmap.mdx'
      },
      // 02-Requirements
      {
        id: 'personas',
        name: 'User Personas',
        category: '02-Requirements > 01-Personas',
        description: 'Template for defining user personas',
        path: '02-Requirements/01-User_Personas/TEMPLATE-personas.mdx'
      },
      {
        id: 'epic',
        name: 'Epic Template',
        category: '02-Requirements > 02-Epics and Stories',
        description: 'Template for creating epics',
        path: '02-Requirements/02-Epics_and_Stories/TEMPLATE-epic.mdx'
      },
      {
        id: 'story',
        name: 'User Story',
        category: '02-Requirements > 02-Epics and Stories',
        description: 'Template for writing user stories',
        path: '02-Requirements/02-Epics_and_Stories/TEMPLATE-story.mdx'
      },
      {
        id: 'use-case',
        name: 'Use Case',
        category: '02-Requirements > 03-Use Cases',
        description: 'Template for detailed use cases',
        path: '02-Requirements/03-Use_Cases/TEMPLATE-use-case.mdx'
      },
      // 03-Design_and_Architecture
      {
        id: 'architecture-overview',
        name: 'Architecture Overview',
        category: '03-Design and Architecture > 01-System Architecture',
        description: 'Template for system architecture documentation',
        path: '03-Design_and_Architecture/01-System_Architecture/TEMPLATE-architecture-overview.mdx'
      },
      {
        id: 'component-design',
        name: 'Component Design',
        category: '03-Design and Architecture > 01-System Architecture',
        description: 'Template for component design documentation',
        path: '03-Design_and_Architecture/01-System_Architecture/TEMPLATE-component-design.mdx'
      },
      {
        id: 'technical-specifications',
        name: 'Technical Specifications',
        category: '03-Design and Architecture > 02-Technical Design',
        description: 'Template for technical specifications',
        path: '03-Design_and_Architecture/02-Technical_Design/TEMPLATE-technical-specifications.mdx'
      },
      // 04-Development_Guidelines
      {
        id: 'best-practices',
        name: 'Best Practices',
        category: '04-Development Guidelines > 01-Coding Standards',
        description: 'Template for development best practices',
        path: '04-Development_Guidelines/01-Coding_Standards/TEMPLATE-best-practices.mdx'
      },
      {
        id: 'coding-conventions',
        name: 'Coding Conventions',
        category: '04-Development Guidelines > 01-Coding Standards',
        description: 'Template for coding conventions',
        path: '04-Development_Guidelines/01-Coding_Standards/TEMPLATE-coding-conventions.mdx'
      },
      // 05-Agile_Planning
      {
        id: 'sprint-planning',
        name: 'Sprint Planning',
        category: '05-Agile Planning > 01-Sprint Planning',
        description: 'Template for sprint planning',
        path: '05-Agile_Planning/01-Sprint_Planning/TEMPLATE-sprint-planning.mdx'
      },
      {
        id: 'sprint-backlog',
        name: 'Sprint Backlog',
        category: '05-Agile Planning > 01-Sprint Planning',
        description: 'Template for sprint backlog',
        path: '05-Agile_Planning/01-Sprint_Planning/TEMPLATE-sprint-backlog.mdx'
      },
      {
        id: 'sprint-goals',
        name: 'Sprint Goals',
        category: '05-Agile Planning > 01-Sprint Planning',
        description: 'Template for sprint goals',
        path: '05-Agile_Planning/01-Sprint_Planning/TEMPLATE-sprint-goals.mdx'
      },
      // 06-Testing
      {
        id: 'testing-guide',
        name: 'Testing Guide',
        category: '06-Testing',
        description: 'Template for testing guidelines and procedures',
        path: '06-Testing/TEMPLATE-testing-guide.mdx'
      },
      // 07-Deployment
      {
        id: 'deployment-checklist',
        name: 'Deployment Checklist',
        category: '07-Deployment > 01-Release Management',
        description: 'Template for deployment checklist',
        path: '07-Deployment/01-Release_Management/TEMPLATE-deployment-checklist.mdx'
      },
      {
        id: 'release-plan',
        name: 'Release Plan',
        category: '07-Deployment > 01-Release Management',
        description: 'Template for release planning',
        path: '07-Deployment/01-Release_Management/TEMPLATE-release-plan.mdx'
      },
      // 08-Maintenance
      {
        id: 'customer-support',
        name: 'Customer Support',
        category: '08-Maintenance > 01-Support',
        description: 'Template for customer support procedures',
        path: '08-Maintenance/01-Support/TEMPLATE-customer-support.mdx'
      },
      {
        id: 'sprint-retrospectives',
        name: 'Sprint Retrospectives',
        category: '08-Maintenance > 02-Retrospectives',
        description: 'Template for maintenance retrospectives',
        path: '08-Maintenance/02-Retrospectives/TEMPLATE-sprint-retrospectives.mdx'
      },
      // 09-Resources
      {
        id: 'external-resources',
        name: 'External Resources',
        category: '09-Resources',
        description: 'Template for external resources documentation',
        path: '09-Resources/TEMPLATE-external-resources.mdx'
      }
    ].sort((a, b) => {
      // Extract numbers from category paths
      const getNumber = (category: string): number => {
        const match = category.match(/^(\d+)-/);
        return match ? parseInt(match[1], 10) : 999;
      };

      // Get main category numbers
      const aMainNum = getNumber(a.category.split(' > ')[0]);
      const bMainNum = getNumber(b.category.split(' > ')[0]);

      if (aMainNum !== bMainNum) {
        return aMainNum - bMainNum;
      }

      // If main categories are the same, check subcategories
      const aSubNum = getNumber(a.category.split(' > ')[1] || '');
      const bSubNum = getNumber(b.category.split(' > ')[1] || '');

      if (aSubNum !== bSubNum) {
        return aSubNum - bSubNum;
      }

      // If subcategories are the same, sort by name
      return a.name.localeCompare(b.name);
    });
  }

  public async createDirectory(path: string): Promise<void> {
    if (this.offlineMode) {
      console.log('Creating directory in offline mode:', path);
      return Promise.resolve();
    }

    try {
      const response = await this.callCursor('create_directory', { path });
      if (!response.success) {
        throw new Error(response.error || 'Failed to create directory');
      }
    } catch (error) {
      console.error('Error creating directory:', error);
      throw error;
    }
  }

  public async saveProjectConfig(project: Project): Promise<void> {
    if (this.offlineMode) {
      console.log('Saving project config in offline mode:', project);
      return Promise.resolve();
    }

    try {
      const configPath = `${project.outputPath}/project.json`;
      const response = await this.callCursor('save_file', {
        path: configPath,
        content: JSON.stringify(project, null, 2)
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to save project configuration');
      }
    } catch (error) {
      console.error('Error saving project configuration:', error);
      throw error;
    }
  }

  public async loadProjectConfig(path: string): Promise<Project> {
    if (this.offlineMode) {
      return {
        id: 'mock-project',
        name: 'Mock Project',
        description: 'Mock project for offline mode',
        outputPath: path,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        specifications: []
      };
    }

    try {
      const configPath = `${path}/project.json`;
      const response = await this.callCursor<{ content: string }>('read_file', { path: configPath });
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load project configuration');
      }
      return JSON.parse(response.data.content);
    } catch (error) {
      console.error('Error loading project configuration:', error);
      throw error;
    }
  }
}

export const templateService = TemplateService.getInstance(); 