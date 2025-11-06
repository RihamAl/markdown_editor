import { Container, Paper } from "@mui/material";
import SignupForm from "../components/SignupForm";
import Navbar from "../components/Navbar";

export default function Signup() {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: `calc(100vh - 64px)`, // subtract AppBar height
         
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 7,
            borderRadius: 3,
            width: "100%",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <SignupForm />
        </Paper>
      </Container>
    </>
  );
}
