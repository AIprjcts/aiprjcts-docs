import React from 'react';
import { Box, Typography, Button, alpha, Container, useTheme, IconButton } from '@mui/material';
import { 
  Description as DescriptionIcon, 
  Add as AddIcon, 
  FolderOpen as FolderOpenIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';

interface HeaderProps {
  onNewProject: () => void;
  onOpenProject: () => void;
  onThemeChange: () => void;
  currentTheme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ onNewProject, onOpenProject, onThemeChange, currentTheme }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 1100,
        backdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.9)' 
          : 'rgba(24, 24, 27, 0.9)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: `0 4px 30px ${alpha(theme.palette.common.black, 0.2)}`,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4 }, width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
            width: '100%',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                color: 'primary.main',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <DescriptionIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'primary.main',
                  lineHeight: 1.2,
                }}
              >
                Project Specifications
              </Typography>
            </Box>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
            }}
          >
            <IconButton
              onClick={onThemeChange}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {currentTheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<FolderOpenIcon />}
              onClick={onOpenProject}
              size="small"
              sx={{
                minWidth: 100,
                borderColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
              }}
            >
              Open
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onNewProject}
              size="small"
              sx={{
                minWidth: 100,
              }}
            >
              New
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header; 