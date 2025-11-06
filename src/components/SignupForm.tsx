import { Box, Button, TextField, Typography } from "@mui/material";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignupForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // use await
      const user = await signup(name, email, password);

      console.log("User signed up successfully:", user);

      if (user?.id) {
        alert("Signup successful!");
        navigate("/login"); // redirect to login page
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Signup failed. Please check your info and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Typography component="h1" variant="h5">
        Create a New Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} width="100%">
        <TextField
          required
          fullWidth
          name="name"
          label="Full Name"
          margin="normal"
        />
        <TextField
          required
          fullWidth
          name="email"
          label="Email Address"
          margin="normal"
        />
        <TextField
          required
          fullWidth
          name="password"
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
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </Box>
    </Box>
  );
}
