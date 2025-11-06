import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          width: "100vw",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          Welcome to the Markdown Editor
        </Typography>
      </Box>
    </>
  );
}
