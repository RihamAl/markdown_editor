import  {   Container, Paper  }  from  "@mui/material" ;
import LoginForm from "../components/LoginForm.tsx";
import Navbar from "../components/Navbar.tsx";

export default function Login() {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm" 
      sx={{display: 'flex',
       flexDirection: 'column', 
       alignItems: 'center', 
       justifyContent: 'center', 
       height: `calc(100vh - 64px)`, // subtract AppBar height
      }}>
        <Paper
          elevation={4}
            sx={{
          p: 7,
          borderRadius: 3,
          width: "100%",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <LoginForm />
      </Paper>  
    </Container>
        </>

  );
}
