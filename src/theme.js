import { createTheme } from '@mui/material/styles'

export const createCustomTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#90caf9' : '#1e3a5f' },
      secondary: { main: '#64748b' },
      background: {
        default: mode === 'dark' ? '#0b0f19' : '#f8fafc',
        paper: mode === 'dark' ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
        secondary: mode === 'dark' ? '#94a3b8' : '#475569',
      },
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 600, letterSpacing: '0.01em' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 200ms ease, color 200ms ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '8px 16px',
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  })

export const theme = createCustomTheme('light')
