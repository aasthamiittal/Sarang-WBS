import { createTheme } from '@mui/material/styles';

const PRIMARY = '#6BAED6';
const SECONDARY = '#FFFFFF';

export default createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      contrastText: SECONDARY,
    },
    secondary: {
      main: SECONDARY,
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: PRIMARY,
        },
      },
    },
  },
});
