import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme, GlobalStyles, PaletteMode, ThemeOptions } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TemplateContainer from './containers/TemplateContainer';

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode
          primary: {
            main: '#18181B',
            light: '#27272A',
            dark: '#09090B',
          },
          secondary: {
            main: '#3F3F46',
            light: '#52525B',
            dark: '#27272A',
          },
          background: {
            default: '#FFFFFF',
            paper: 'rgba(255, 255, 255, 0.9)',
          },
          text: {
            primary: '#18181B',
            secondary: '#3F3F46',
          },
          divider: 'rgba(24, 24, 27, 0.12)',
        }
      : {
          // Dark mode
          primary: {
            main: '#FFFFFF',
            light: '#FAFAFA',
            dark: '#E5E5E5',
          },
          secondary: {
            main: '#D4D4D8',
            light: '#E4E4E7',
            dark: '#A1A1AA',
          },
          background: {
            default: '#09090B',
            paper: 'rgba(24, 24, 27, 0.9)',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#D4D4D8',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
        }),
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: 0,
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: 0,
    },
    body1: {
      letterSpacing: 0,
    },
    body2: {
      letterSpacing: 0,
    },
    button: {
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: mode === 'light' 
            ? 'linear-gradient(45deg, #18181B 30%, #27272A 90%)'
            : 'linear-gradient(45deg, #FFFFFF 30%, #FAFAFA 90%)',
          color: mode === 'light' ? '#FFFFFF' : '#18181B',
          '&:hover': {
            background: mode === 'light'
              ? 'linear-gradient(45deg, #27272A 30%, #3F3F46 90%)'
              : 'linear-gradient(45deg, #FAFAFA 30%, #F4F4F5 90%)',
          },
        },
        outlinedPrimary: {
          borderColor: mode === 'light' ? 'rgba(24, 24, 27, 0.23)' : 'rgba(255, 255, 255, 0.23)',
          '&:hover': {
            borderColor: mode === 'light' ? '#18181B' : '#FFFFFF',
            background: mode === 'light' ? 'rgba(24, 24, 27, 0.04)' : 'rgba(255, 255, 255, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${mode === 'light' ? 'rgba(24, 24, 27, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>('dark');
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const globalStyles = {
    '*::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '*::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '*::-webkit-scrollbar-thumb': {
      background: theme.palette.mode === 'light' ? '#D4D4D8' : '#3F3F46',
      borderRadius: '4px',
    },
    '*::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.mode === 'light' ? '#A1A1AA' : '#52525B',
    },
  };

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/*"
              element={
                <TemplateContainer
                  onThemeChange={toggleTheme}
                  currentTheme={mode}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
