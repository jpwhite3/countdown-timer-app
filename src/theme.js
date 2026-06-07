import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e3a5f' },
    secondary: { main: '#64748b' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    warning: { main: '#d97706' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 2 },
    },
  },
})
