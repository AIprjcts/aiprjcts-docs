import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import Editor from '@monaco-editor/react';

interface SpecificationPreviewProps {
  content: string;
  onEdit: (newContent: string) => void;
  onSave: () => void;
  onBack: () => void;
}

const SpecificationPreview: React.FC<SpecificationPreviewProps> = ({
  content,
  onEdit,
  onSave,
  onBack
}) => {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onEdit(value);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Preview Specification
        </Typography>
        
        <Box sx={{ mt: 3, mb: 3, height: '60vh' }}>
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={content}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" onClick={onSave}>
            Save Specification
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SpecificationPreview; 