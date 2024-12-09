import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route, Navigate } from 'react-router-dom';
import { Alert, CircularProgress, Box, Typography } from '@mui/material';
import { Template } from '../components/TemplateSelector';
import TemplateSelector from '../components/TemplateSelector';
import TemplateForm from '../components/TemplateForm';
import ProjectDialog from '../components/ProjectDialog';
import { templateService } from '../services/templateService';
import { Project, ProjectConfig, Specification } from '../types/project';
import { TemplateStructure, TemplateVariable } from '../types/template';
import { parseTemplateContent } from '../services/templateParser';
import Header from '../components/Header';

interface LoadingState {
  templates: boolean;
  templateContent: boolean;
  project?: boolean;
}

interface TemplateContainerProps {
  onThemeChange: () => void;
  currentTheme: 'light' | 'dark';
}

export const TemplateContainer: React.FC<TemplateContainerProps> = ({ onThemeChange, currentTheme }) => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateStructure, setTemplateStructure] = useState<TemplateStructure | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    templates: true,
    templateContent: false,
    project: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [showProjectDialog, setShowProjectDialog] = useState<boolean>(false);

  // Load templates
  useEffect(() => {
    const loadTemplatesData = async () => {
      try {
        setLoading((prev) => ({ ...prev, templates: true }));
        setError(null);
        const loadedTemplates = await templateService.loadTemplates();
        setTemplates(loadedTemplates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setLoading((prev) => ({ ...prev, templates: false }));
      }
    };

    loadTemplatesData();
  }, []);

  // Load template content when a template is selected
  useEffect(() => {
    const loadTemplateContent = async () => {
      if (templateId) {
        try {
          setLoading((prev) => ({ ...prev, templateContent: true }));
          setError(null);
          const template = templates.find((t) => t.id === templateId);
          if (template) {
            setSelectedTemplate(template);
            const content = await templateService.loadTemplateContent(template.path);
            const structure = parseTemplateContent(content);
            setTemplateStructure(structure);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load template content');
        } finally {
          setLoading((prev) => ({ ...prev, templateContent: false }));
        }
      }
    };

    if (templateId) {
      loadTemplateContent();
    }
  }, [templateId, templates]);

  const handleNewProject = () => {
    setShowProjectDialog(true);
  };

  const handleOpenProject = async () => {
    // TODO: Implement open project functionality
  };

  const handleProjectSubmit = async (config: ProjectConfig) => {
    try {
      setLoading((prev) => ({ ...prev, project: true }));
      setError(null);

      // Create project directory
      await templateService.createDirectory(config.outputPath);

      // Create project.json
      const project: Project = {
        id: Date.now().toString(),
        name: config.name,
        description: config.description,
        outputPath: config.outputPath,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        specifications: [],
      };

      // Save project.json
      await templateService.saveProjectConfig(project);

      setCurrentProject(project);
      setShowProjectDialog(false);
      navigate('/templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading((prev) => ({ ...prev, project: false }));
    }
  };

  const handleTemplateSelect = async (template: Template) => {
    if (!currentProject) {
      setError('Please create or open a project first');
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, templateContent: true }));
      const content = await templateService.loadTemplateContent(template.path);
      const structure = parseTemplateContent(content);
      setSelectedTemplate(template);
      setTemplateStructure(structure);
      navigate(`/template/${template.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load template content');
    } finally {
      setLoading((prev) => ({ ...prev, templateContent: false }));
    }
  };

  const handleFormSubmit = async (variables: TemplateVariable[]) => {
    try {
      setError(null);
      if (!selectedTemplate || !templateStructure || !currentProject) {
        setError('Missing template or project information');
        return;
      }

      // Convert variables to the format expected by the service
      const formData = variables.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string | string[]>);

      // Create specification directory if it doesn't exist
      const specDir = `${currentProject.outputPath}/specifications/${selectedTemplate.id}`;
      await templateService.createDirectory(specDir);

      // Generate specification content
      const content = await templateService.generateSpecification(
        selectedTemplate.path,
        formData,
        specDir
      );

      // Create new specification
      const newSpec: Specification = {
        id: Date.now().toString(),
        name: selectedTemplate.name,
        templateId: selectedTemplate.id,
        path: `${specDir}/${selectedTemplate.id}-${Date.now()}.mdx`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft' as const,
      };

      // Update project with new specification
      const updatedProject: Project = {
        ...currentProject,
        specifications: [...currentProject.specifications, newSpec],
        updatedAt: new Date().toISOString(),
      };

      // Save specification and update project
      await templateService.saveSpecification(newSpec.path, content);
      await templateService.updateProject(updatedProject);
      
      setCurrentProject(updatedProject);
      navigate('/templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate specification');
    }
  };

  return (
    <Box>
      <ProjectDialog
        open={showProjectDialog}
        onClose={() => setShowProjectDialog(false)}
        onSubmit={handleProjectSubmit}
        isNew={true}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme => theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
              }}
            >
              <Header 
                onNewProject={handleNewProject}
                onOpenProject={handleOpenProject}
                onThemeChange={onThemeChange}
                currentTheme={currentTheme}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    maxWidth: 600,
                    width: '100%',
                    p: 4,
                    borderRadius: 4,
                    backdropFilter: 'blur(20px)',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.98)'
                        : 'rgba(24, 24, 27, 0.98)',
                    boxShadow: (theme) =>
                      `0 8px 32px ${
                        theme.palette.mode === 'light'
                          ? 'rgba(0, 0, 0, 0.1)'
                          : 'rgba(0, 0, 0, 0.3)'
                      }`,
                  }}
                >
                  <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Welcome to Project Specifications
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Create and manage your project specifications with ease.
                  </Typography>
                </Box>
              </Box>
            </Box>
          }
        />
        <Route
          path="/templates"
          element={
            <>
              <Header 
                onNewProject={handleNewProject}
                onOpenProject={handleOpenProject}
                onThemeChange={onThemeChange}
                currentTheme={currentTheme}
              />
              {currentProject ? (
                <TemplateSelector templates={templates} onSelect={handleTemplateSelect} />
              ) : (
                <Navigate to="/" replace />
              )}
            </>
          }
        />
        <Route
          path="/template/:templateId"
          element={
            <Box sx={{ 
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: theme => theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}>
              <Header 
                onNewProject={handleNewProject}
                onOpenProject={handleOpenProject}
                onThemeChange={onThemeChange}
                currentTheme={currentTheme}
              />
              {loading.templateContent ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                  <CircularProgress />
                </Box>
              ) : selectedTemplate && templateStructure ? (
                <TemplateForm
                  template={templateStructure}
                  onSubmit={handleFormSubmit}
                  onBack={() => navigate('/templates')}
                />
              ) : (
                <Navigate to="/templates" replace />
              )}
            </Box>
          }
        />
      </Routes>

      {error && (
        <Box sx={{ p: 3, position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1200 }}>
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              borderRadius: 3,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {loading.project && (
        <Box 
          sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default TemplateContainer; 