import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/work-sans/400.css'
import '@fontsource/work-sans/500.css'
import '@fontsource/work-sans/600.css'
import '@fontsource/work-sans/700.css'

import { alpha, createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
      light: '#5eead4',
      dark: '#115e59',
    },
    secondary: {
      main: '#c2410c',
      light: '#fdba74',
      dark: '#9a3412',
    },
    background: {
      default: '#f8f1e7',
      paper: 'rgba(255, 250, 245, 0.88)',
    },
    text: {
      primary: '#17212b',
      secondary: '#5f6978',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#b45309',
    },
    divider: 'rgba(23, 33, 43, 0.1)',
  },
  typography: {
    fontFamily: '"Work Sans", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontSize: 'clamp(2.8rem, 6vw, 4.6rem)',
      fontWeight: 700,
      lineHeight: 1,
    },
    h2: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
      lineHeight: 1.05,
    },
    h3: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0.1,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${alpha('#17212b', 0.08)}`,
          boxShadow: '0 24px 80px rgba(23, 33, 43, 0.08)',
          backdropFilter: 'blur(14px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          minHeight: 44,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#ffffff', 0.72),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha('#fffaf5', 0.82),
          color: '#17212b',
          boxShadow: 'none',
          border: `1px solid ${alpha('#17212b', 0.08)}`,
          backdropFilter: 'blur(16px)',
        },
      },
    },
  },
})
