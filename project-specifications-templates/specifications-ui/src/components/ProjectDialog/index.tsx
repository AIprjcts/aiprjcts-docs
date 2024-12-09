import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { ProjectConfig } from '../../types/project';

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (config: ProjectConfig) => void;
  isNew?: boolean;
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isNew = true,
}) => {
  const [formData, setFormData] = useState<ProjectConfig>({
    name: '',
    description: '',
    outputPath: 'projects/',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setValidationError('Project name is required');
      return;
    }

    if (!formData.outputPath.trim()) {
      setValidationError('Output path is required');
      return;
    }

    onSubmit(formData);
  };

  const hasNameError = Boolean(validationError && !formData.name.trim());
  const hasPathError = Boolean(validationError && !formData.outputPath.trim());

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 2,
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 3 }}>
        <Typography variant="h5" component="div" fontWeight={600}>
          {isNew ? 'Create New Project' : 'Open Project'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {isNew 
            ? 'Enter the details for your new project. A project folder will be created at the specified location.'
            : 'Select an existing project to open.'
          }
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 2 }}>
          <TextField
            label="Project Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            error={hasNameError}
            helperText={hasNameError ? 'Project name is required' : ''}
            InputProps={{
              sx: {}
            }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            InputProps={{
              sx: {}
            }}
          />

          <TextField
            label="Project Location"
            fullWidth
            value={formData.outputPath}
            onChange={(e) => setFormData(prev => ({ ...prev, outputPath: e.target.value }))}
            required
            error={hasPathError}
            helperText={hasPathError ? 'Project location is required' : 'The folder where project files will be stored'}
            InputProps={{
              sx: {}
            }}
          />

          {validationError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {validationError}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
        >
          {isNew ? 'Create Project' : 'Open Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog; 