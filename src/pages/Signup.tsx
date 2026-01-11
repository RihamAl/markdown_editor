import { Container } from "@mui/material";
import SignupForm from "../components/SignupForm";
import Navbar from "../components/Navbar";

export default function Signup() {
  return (<>
        <Navbar />
        <Container
    sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <SignupForm />
  </Container>
  
      </>
  );
}
