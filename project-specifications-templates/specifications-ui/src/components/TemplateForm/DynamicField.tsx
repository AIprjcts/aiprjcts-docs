import React from 'react';
import { TextField, Box, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { TemplateField } from '../../types/template';

interface DynamicFieldProps {
  field: TemplateField;
  value: string | string[];
  onChange: (key: string, value: string | string[]) => void;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange }) => {
  const handleChange = (newValue: string | string[], index?: number) => {
    if (field.type === 'list' && Array.isArray(value) && typeof index === 'number') {
      const newList = [...value];
      newList[index] = newValue as string;
      onChange(field.key, newList);
    } else {
      onChange(field.key, newValue);
    }
  };

  const addListItem = () => {
    if (Array.isArray(value)) {
      onChange(field.key, [...value, '']);
    }
  };

  const removeListItem = (index: number) => {
    if (Array.isArray(value)) {
      const newList = value.filter((_, i) => i !== index);
      onChange(field.key, newList);
    }
  };

  const commonTextFieldProps = {
    fullWidth: true,
    required: field.required,
    placeholder: field.placeholder,
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 1,
      }
    }
  };

  if (field.type === 'list' && Array.isArray(value)) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {value.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              {...commonTextFieldProps}
              label={`${field.label} ${index + 1}`}
              value={item}
              onChange={(e) => handleChange(e.target.value, index)}
            />
            <IconButton
              onClick={() => removeListItem(index)}
              sx={{ 
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}
        {(!field.listItems || value.length < field.listItems) && (
          <IconButton
            onClick={addListItem}
            sx={{ 
              alignSelf: 'flex-start',
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          >
            <AddIcon />
          </IconButton>
        )}
      </Box>
    );
  }

  if (field.type === 'textarea') {
    return (
      <TextField
        {...commonTextFieldProps}
        label={field.label}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        multiline
        rows={4}
      />
    );
  }

  return (
    <TextField
      {...commonTextFieldProps}
      label={field.label}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      type={field.type === 'date' ? 'date' : 'text'}
    />
  );
};

export default DynamicField; 