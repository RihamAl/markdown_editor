import { createTheme } from "@mui/material/styles";

// Define a simple, custom theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF'
    },
    secondary: {
      main:'#00BFA6'
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 12, // rounded buttons, cards, etc.
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', sans-serif`,
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  }
}); 
