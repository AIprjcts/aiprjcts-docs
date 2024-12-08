import React from 'react';
import { TextField, Stack, FormHelperText, IconButton, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { TemplateField } from '../../types/template';

interface DynamicFieldProps {
  field: TemplateField;
  value: string | string[];
  onChange: (key: string, value: string | string[]) => void;
  error?: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange, error }) => {
  const handleChange = (newValue: string | string[] | Date | null) => {
    if (newValue instanceof Date) {
      onChange(field.key, newValue.toISOString().split('T')[0]);
    } else if (newValue !== null) {
      onChange(field.key, newValue);
    }
  };

  const handleListItemChange = (index: number, itemValue: string) => {
    const newValues = Array.isArray(value) ? [...value] : [];
    newValues[index] = itemValue;
    onChange(field.key, newValues);
  };

  const addListItem = () => {
    const newValues = Array.isArray(value) ? [...value, ''] : [''];
    onChange(field.key, newValues);
  };

  const removeListItem = (index: number) => {
    if (Array.isArray(value)) {
      const newValues = value.filter((_, i) => i !== index);
      onChange(field.key, newValues);
    }
  };

  const commonProps = {
    required: field.required,
    fullWidth: true,
    error: !!error,
    helperText: error,
    placeholder: field.placeholder,
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 1)',
        },
        '&.Mui-focused': {
          backgroundColor: 'rgba(255, 255, 255, 1)',
        }
      },
      '& .MuiInputLabel-root': {
        fontFamily: 'Inter',
      },
      '& .MuiInputBase-input': {
        fontFamily: 'Inter',
      }
    }
  };

  switch (field.type) {
    case 'textarea':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          multiline
          rows={4}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case 'list':
      return (
        <Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontFamily: 'Inter',
              fontWeight: 500,
              color: 'text.secondary'
            }}
          >
            {field.label}
          </Typography>
          <Stack spacing={2}>
            {(Array.isArray(value) ? value : []).map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  {...commonProps}
                  value={item}
                  onChange={(e) => handleListItemChange(index, e.target.value)}
                  placeholder={`${field.placeholder || field.label} ${index + 1}`}
                  sx={{
                    ...commonProps.sx,
                    flex: 1,
                  }}
                />
                <IconButton 
                  onClick={() => removeListItem(index)}
                  sx={{ 
                    bgcolor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'error.dark',
                    }
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
            <IconButton
              onClick={addListItem}
              sx={{ 
                alignSelf: 'flex-start',
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Stack>
          {error && (
            <FormHelperText error sx={{ mt: 1 }}>
              {error}
            </FormHelperText>
          )}
        </Box>
      );

    case 'date':
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={field.label}
            value={value ? new Date(value as string) : null}
            onChange={handleChange}
            slotProps={{
              textField: {
                ...commonProps,
              },
            }}
          />
        </LocalizationProvider>
      );

    case 'version':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="e.g., 1.0.0"
          inputProps={{
            pattern: '\\d+\\.\\d+\\.\\d+',
          }}
        />
      );

    default:
      return (
        <TextField
          {...commonProps}
          label={field.label}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
  }
};

export default DynamicField; 