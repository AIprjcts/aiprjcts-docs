import React, { useMemo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Collapse,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { Specification } from '../../types/project';

interface SpecificationsBrowserProps {
  specifications: Specification[];
  onEditSpecification: (spec: Specification) => void;
  onDeleteSpecification: (spec: Specification) => void;
}

interface SpecGroup {
  [category: string]: {
    [subcategory: string]: Specification[];
  };
}

const SpecificationsBrowser: React.FC<SpecificationsBrowserProps> = ({
  specifications,
  onEditSpecification,
  onDeleteSpecification,
}) => {
  const theme = useTheme();
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);

  const groupedSpecs = useMemo(() => {
    const groups: SpecGroup = {};
    specifications.forEach((spec) => {
      const [category = 'Other', subcategory = 'General'] = spec.templateId.split('/');
      if (!groups[category]) {
        groups[category] = {};
      }
      if (!groups[category][subcategory]) {
        groups[category][subcategory] = [];
      }
      groups[category][subcategory].push(spec);
    });
    return groups;
  }, [specifications]);

  const handleCategoryToggle = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Box
      sx={{
        width: 300,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100%',
        overflow: 'auto',
        bgcolor: theme.palette.mode === 'light'
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Specifications
        </Typography>
      </Box>

      <List>
        {Object.entries(groupedSpecs).map(([category, subcategories]) => (
          <Box key={category}>
            <ListItemButton
              onClick={() => handleCategoryToggle(category)}
              sx={{
                py: 1,
                px: 2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FolderIcon
                  sx={{
                    color: theme.palette.mode === 'light'
                      ? alpha(theme.palette.primary.main, 0.7)
                      : alpha(theme.palette.primary.main, 0.5),
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={category}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  fontWeight: 600,
                }}
              />
              {expandedCategories.includes(category) ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </ListItemButton>

            <Collapse in={expandedCategories.includes(category)}>
              {Object.entries(subcategories).map(([subcategory, specs]) => (
                <Box key={`${category}/${subcategory}`} sx={{ pl: 2 }}>
                  <ListItem
                    sx={{
                      py: 1,
                      px: 2,
                    }}
                  >
                    <ListItemText
                      primary={subcategory}
                      primaryTypographyProps={{
                        variant: 'caption',
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    />
                  </ListItem>
                  {specs.map((spec) => (
                    <ListItem
                      key={spec.id}
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => onEditSpecification(spec)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => onDeleteSpecification(spec)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                      disablePadding
                    >
                      <ListItemButton
                        sx={{
                          py: 1,
                          px: 2,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <DescriptionIcon
                            fontSize="small"
                            sx={{ color: 'text.secondary' }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={spec.name}
                          primaryTypographyProps={{
                            variant: 'body2',
                            noWrap: true,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Box>
              ))}
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default SpecificationsBrowser; 