import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Stepper, Step, StepLabel, Divider, Alert, TextField } from '@mui/material';
import { TemplateStructure, TemplateVariable } from '../../types/template';
import DynamicField from './DynamicField';

interface TemplateFormProps {
  template: TemplateStructure;
  onSubmit: (variables: TemplateVariable[]) => void;
  onBack: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSubmit, onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: string | string[] }>({});
  const [outputPath, setOutputPath] = useState<string>('specifications/');

  const handleFieldChange = (key: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (activeStep === template.sections.length) {
      const variables = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
      }));
      onSubmit(variables);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      onBack();
    } else {
      setActiveStep(prev => prev - 1);
    }
  };

  const isStepComplete = (step: number) => {
    if (step === template.sections.length) return true; // Output path step
    const currentSection = template.sections[step];
    return currentSection.fields.every(field => {
      const value = formData[field.key];
      if (field.required) {
        if (Array.isArray(value)) {
          return value.every(v => v.trim() !== '');
        }
        return value && value.toString().trim() !== '';
      }
      return true;
    });
  };

  const renderStepContent = (step: number) => {
    if (step === template.sections.length) {
      // Output path step
      return (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            The specification will be generated in the following directory. This will create a new folder if it doesn't exist.
          </Alert>
          <TextField
            fullWidth
            label="Output Directory"
            value={outputPath}
            onChange={(e) => setOutputPath(e.target.value)}
            helperText="Specify the directory where the specification will be saved"
            sx={{ mb: 2 }}
          />
        </Box>
      );
    }

    const section = template.sections[step];
    return (
      <Box sx={{ mt: 3 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: 'primary.main',
            mb: 3,
            textAlign: 'center'
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
    );
  };

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '800px', mx: 'auto' }}>
      <Paper 
        sx={{ 
          p: 4,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          bgcolor: theme => theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(24, 24, 27, 0.95)',
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

        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
          }}
        >
          {template.sections.map((section, index) => (
            <Step key={index} completed={isStepComplete(index)}>
              <StepLabel>{section.title}</StepLabel>
            </Step>
          ))}
          <Step key="output" completed={isStepComplete(template.sections.length)}>
            <StepLabel>Output Location</StepLabel>
          </Step>
        </Stepper>

        <Divider sx={{ mb: 4 }} />

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ 
              minWidth: 120,
            }}
          >
            {activeStep === 0 ? 'Back to Templates' : 'Previous'}
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepComplete(activeStep)}
            sx={{ 
              minWidth: 120,
            }}
          >
            {activeStep === template.sections.length ? 'Generate' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TemplateForm; 