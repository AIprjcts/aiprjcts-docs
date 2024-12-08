import React from 'react';
import { Box, Tabs, Tab, alpha } from '@mui/material';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 72, // Header height + spacing
        zIndex: 1000,
        mb: 3,
        px: 4,
        backdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => onCategoryChange(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 2,
              borderRadius: 1,
            },
            '& .MuiTabs-scrollButtons': {
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category}
              value={category}
              sx={{
                textTransform: 'none',
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '0.9375rem',
                letterSpacing: '-0.01em',
                color: 'text.secondary',
                minHeight: 48,
                px: 3,
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default CategoryTabs; 