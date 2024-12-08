import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Divider, Stack, TextField } from '@mui/material';
import Editor from '@monaco-editor/react';

interface Version {
  id: string;
  content: string;
  timestamp: Date;
  comment: string;
}

interface IterativeEditorProps {
  currentVersion: Version;
  versions: Version[];
  onSaveVersion: (content: string, comment: string) => void;
  onVersionSelect: (version: Version) => void;
  onBack: () => void;
}

const IterativeEditor: React.FC<IterativeEditorProps> = ({
  currentVersion,
  versions,
  onSaveVersion,
  onVersionSelect,
  onBack
}) => {
  const [editedContent, setEditedContent] = useState(currentVersion.content);
  const [versionComment, setVersionComment] = useState('');

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditedContent(value);
    }
  };

  const handleSave = () => {
    onSaveVersion(editedContent, versionComment || 'Updated specification');
    setVersionComment(''); // Reset comment after save
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Iterative Editor
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, height: '70vh' }}>
          {/* Version History Sidebar */}
          <Stack spacing={2} sx={{ width: 250 }}>
            <Typography variant="h6">Version History</Typography>
            <Divider />
            {versions.map((version) => (
              <Button
                key={version.id}
                variant={version.id === currentVersion.id ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onVersionSelect(version)}
              >
                <Box>
                  <Typography variant="caption" display="block">
                    {new Date(version.timestamp).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {version.comment}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Stack>

          {/* Editor */}
          <Box sx={{ flexGrow: 1 }}>
            <Editor
              height="calc(100% - 60px)"
              defaultLanguage="markdown"
              value={editedContent}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
              }}
            />
            <TextField
              fullWidth
              size="small"
              placeholder="Version comment"
              value={versionComment}
              onChange={(e) => setVersionComment(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default IterativeEditor; 