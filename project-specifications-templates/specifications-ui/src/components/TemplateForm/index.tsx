import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField } from '@mui/material';
import { TemplateStructure, TemplateVariable } from '../../types/template';
import DynamicField from './DynamicField';

interface TemplateFormProps {
  template: TemplateStructure;
  onSubmit: (variables: TemplateVariable[]) => void;
  onBack: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<{ [key: string]: string | string[] }>({});
  const [outputPath, setOutputPath] = useState<string>('specifications/');

  const handleFieldChange = (key: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    const variables = Object.entries(formData).map(([key, value]) => ({
      key,
      value,
    }));
    onSubmit(variables);
  };

  return (
    <Box sx={{ 
      p: 3, 
      width: '100%', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: 'calc(100vh - 72px)',
      bgcolor: theme => theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
    }}>
      <Paper 
        sx={{ 
          p: 4,
          width: '100%',
          maxWidth: '100%',
          backdropFilter: 'blur(10px)',
          bgcolor: theme => theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(24, 24, 27, 0.98)',
          boxShadow: theme => `0 8px 32px ${
            theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(0, 0, 0, 0.3)'
          }`,
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mb: 4,
            textAlign: 'center'
          }}
        >
          {template.metadata.documentType}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {template.sections.map((section, sectionIndex) => (
            <Box key={sectionIndex}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  mb: 3,
                  textAlign: 'left',
                  fontWeight: 600
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {section.fields.map((field) => (
                  <DynamicField
                    key={field.key}
                    field={field}
                    value={formData[field.key] || (field.type === 'list' ? [] : '')}
                    onChange={handleFieldChange}
                  />
                ))}
              </Box>
            </Box>
          ))}

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 3, fontWeight: 600 }}>
              Output Location
            </Typography>
            <TextField
              fullWidth
              label="Output Directory"
              value={outputPath}
              onChange={(e) => setOutputPath(e.target.value)}
              helperText="Specify the directory where the specification will be saved"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          >
            Back to Templates
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          >
            Generate
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TemplateForm; 