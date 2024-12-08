import React, { useState, useMemo } from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import TemplateCard from './TemplateCard';
import CategoryNav from '../CategoryNav';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  path: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
}) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = useMemo(() => {
    const allCategories = Array.from(new Set(templates.map(template => template.category)));
    return allCategories.sort((a, b) => {
      // Extract numbers from category paths
      const getNumber = (category: string): number => {
        const match = category.match(/^(\d+)-/);
        return match ? parseInt(match[1], 10) : 999;
      };

      const aNum = getNumber(a);
      const bNum = getNumber(b);
      
      if (aNum !== bNum) {
        return aNum - bNum;
      }
      return a.localeCompare(b);
    });
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const filtered = !selectedCategory 
      ? templates 
      : templates.filter(template => template.category === selectedCategory);

    return filtered.sort((a, b) => {
      // Extract numbers from paths
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
  }, [templates, selectedCategory]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex',
      bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
      width: '100%',
    }}>
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <Box sx={{ flex: 1, p: 3, width: '100%' }}>
        <Container maxWidth={false} sx={{ width: '100%', maxWidth: '1400px', mx: 'auto' }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              {selectedCategory || 'All Templates'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select a template to create a new specification
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {filteredTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <TemplateCard
                  template={template}
                  onClick={() => onSelect(template)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default TemplateSelector; 