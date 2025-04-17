import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Comprehensive MUI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#538771', // Oxford Green
      light: '#6a9f89', // Lighter variant
      dark: '#3c6f59', // Darker variant
      contrastText: '#fff',
    },
    secondary: {
      main: '#F89300', // Explorers Orange
      light: '#ffa733', // Lighter variant
      dark: '#c27400', // Darker variant
      contrastText: '#000',
    },
    background: {
      default: '#FDFAF7', // Parchment 100
      paper: '#ffffff',
      drawer: '#FEFCFB', // Parchment 50 - for the left menu
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#538771', // Using Oxford Green for consistency
      light: '#6a9f89',
      dark: '#3c6f59',
    },
    success: {
      main: '#538771', // Using Oxford Green for consistency
      light: '#6a9f89',
      dark: '#3c6f59',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'PT Sans',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Patua One", display',
      fontSize: '2.5rem',
      fontWeight: 400, // Patua One only comes in regular weight
    },
    h2: {
      fontFamily: '"Patua One", display',
      fontSize: '2rem',
      fontWeight: 400,
    },
    h3: {
      fontFamily: '"Patua One", display',
      fontSize: '1.75rem',
      fontWeight: 400,
    },
    h4: {
      fontFamily: '"Patua One", display',
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h5: {
      fontFamily: '"Patua One", display',
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"Patua One", display',
      fontSize: '1rem',
      fontWeight: 400,
    },
    subtitle1: {
      fontFamily: '"PT Sans", sans-serif',
      fontSize: '1.125rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontFamily: '"PT Sans", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 700,
    },
    body1: {
      fontFamily: '"PT Sans", sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"PT Sans", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"PT Sans", sans-serif',
      fontWeight: 700,
    },
    caption: {
      fontFamily: '"PT Sans", sans-serif',
      fontSize: '0.75rem',
    },
    overline: {
      fontFamily: '"PT Sans", sans-serif',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents all-caps text in buttons
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Removes default gradient
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Removes default gradient
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FEFCFB', // Parchment 50
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#EEEEEE',
            // color: '#fff',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-cell': {
            color: '#000',
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
