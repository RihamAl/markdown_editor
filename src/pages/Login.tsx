import { Container } from "@mui/material";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

export default function Login() {
  return (
    <>
      <Navbar />
      <Container
  sx={{
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <LoginForm />
</Container>

    </>
  );
}
