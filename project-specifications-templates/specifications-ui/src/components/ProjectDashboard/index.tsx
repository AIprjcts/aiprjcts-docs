import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  alpha,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Project, Specification } from '../../types/project';

interface ProjectDashboardProps {
  project: Project | null;
  onNewProject: () => void;
  onOpenProject: () => void;
  onEditSpecification: (spec: Specification) => void;
  onDeleteSpecification: (spec: Specification) => void;
  onNewSpecification: () => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  project,
  onNewProject,
  onOpenProject,
  onEditSpecification,
  onDeleteSpecification,
  onNewSpecification,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {!project ? (
        <>
          <Box
            sx={{
              position: 'relative',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              px: 3,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: `
                  url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2360A5FA' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                `,
                zIndex: 0,
              }}
            />
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Project Specifications
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    maxWidth: '800px',
                    mx: 'auto',
                  }}
                >
                  Create and manage professional project specifications with our template-driven approach
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 4,
                  maxWidth: '1000px',
                  mx: 'auto',
                }}
              >
                <Card
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 48, color: 'primary.light', mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Create New Project
                  </Typography>
                  <Typography sx={{ mb: 4, color: 'text.secondary' }}>
                    Start fresh with a new project and choose from our collection of professional templates
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onNewProject}
                    sx={{
                      mt: 'auto',
                      width: '100%',
                      py: 1.5,
                    }}
                  >
                    New Project
                  </Button>
                </Card>

                <Card
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <FolderOpenIcon sx={{ fontSize: 48, color: 'secondary.light', mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Open Existing Project
                  </Typography>
                  <Typography sx={{ mb: 4, color: 'text.secondary' }}>
                    Continue working on an existing project and manage your specifications
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<FolderOpenIcon />}
                    onClick={onOpenProject}
                    sx={{
                      mt: 'auto',
                      width: '100%',
                      py: 1.5,
                    }}
                  >
                    Open Project
                  </Button>
                </Card>
              </Box>
            </Container>
          </Box>
        </>
      ) : (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              {project.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {project.description}
            </Typography>
          </Box>

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onNewSpecification}
              sx={{
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              New Specification
            </Button>
          </Box>

          <Grid container spacing={3}>
            {project.specifications.map((spec) => (
              <Grid item xs={12} md={6} key={spec.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <DescriptionIcon color="primary" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                          {spec.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created: {new Date(spec.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => onEditSpecification(spec)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => onDeleteSpecification(spec)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default ProjectDashboard; 