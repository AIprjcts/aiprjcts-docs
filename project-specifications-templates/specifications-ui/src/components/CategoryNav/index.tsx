import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, alpha, useTheme } from '@mui/material';
import {
  Visibility as VisionIcon,
  TrendingUp as MarketIcon,
  Route as StrategyIcon,
  Person as PersonaIcon,
  Assignment as RequirementsIcon,
  Architecture as ArchitectureIcon,
  Code as DevelopmentIcon,
  Timer as AgileIcon,
  BugReport as TestingIcon,
  Rocket as DeploymentIcon,
  Build as MaintenanceIcon,
  Link as ResourcesIcon,
} from '@mui/icons-material';

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const getCategoryIcon = (category: string) => {
  const baseCategory = category.split(' > ')[0].toLowerCase();
  switch (baseCategory) {
    case 'discovery and planning':
      return <VisionIcon />;
    case 'market research':
      return <MarketIcon />;
    case 'product strategy':
      return <StrategyIcon />;
    case 'requirements':
      return <RequirementsIcon />;
    case 'personas':
      return <PersonaIcon />;
    case 'design and architecture':
      return <ArchitectureIcon />;
    case 'development guidelines':
      return <DevelopmentIcon />;
    case 'agile planning':
      return <AgileIcon />;
    case 'testing':
      return <TestingIcon />;
    case 'deployment':
      return <DeploymentIcon />;
    case 'maintenance':
      return <MaintenanceIcon />;
    case 'resources':
      return <ResourcesIcon />;
    default:
      return <RequirementsIcon />;
  }
};

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const theme = useTheme();
  const uniqueBaseCategories = Array.from(new Set(categories.map(cat => cat.split(' > ')[0])));

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100%',
        overflow: 'auto',
        position: 'sticky',
        top: 72,
        bgcolor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <List sx={{ py: 2 }}>
        {uniqueBaseCategories.map((baseCategory) => {
          const subCategories = categories.filter(cat => cat.startsWith(baseCategory));
          return (
            <Box key={baseCategory} sx={{ mb: 2 }}>
              <Typography
                variant="overline"
                sx={{
                  px: 3,
                  py: 1,
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {baseCategory}
              </Typography>
              {subCategories.map((category) => (
                <ListItem key={category} disablePadding>
                  <ListItemButton
                    selected={category === selectedCategory}
                    onClick={() => onSelectCategory(category)}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                      {getCategoryIcon(category)}
                    </ListItemIcon>
                    <ListItemText
                      primary={category.split(' > ')[1] || category}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: category === selectedCategory ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default CategoryNav; 