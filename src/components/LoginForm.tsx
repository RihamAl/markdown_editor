import { Box, Button, TextField, Typography } from "@mui/material";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // use await
      const user = await login(email, password);

      console.log("User logged in successfully:", user);

      if (user?.sessionToken) {
        alert("Login successful!");
        navigate("/documents"); // redirect to documents page
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      <Typography component="h1" variant="h5">
        Log In to Your Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} width="100%">
        <TextField
          required
          fullWidth
          name="email" // use name
          label="Email Address"
          margin="normal"
        />
        <TextField
          required
          fullWidth
          name="password" // use name
          label="Password"
          type="password"
          margin="normal"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
        </Box>
    </Box>
  );
}
