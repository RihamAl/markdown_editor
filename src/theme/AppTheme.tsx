import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactNode } from "react";
import { theme } from "./theme";

// Wrapper component for your app
interface AppThemeProps {
  children: ReactNode;
}

export default function AppTheme({ children }: AppThemeProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes default CSS */}
      {children}
    </ThemeProvider>
  );
}
