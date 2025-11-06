// components/Navbar.tsx
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Markdown Editor
        </Typography>
        <Button color="inherit" href="/login">Log In</Button>
        <Button color="inherit" href="/signup">Sign Up</Button>
      </Toolbar>
    </AppBar>
  );
}
