import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Container, Paper, Stack } from "@mui/material";
import { login } from "../api/data";

const SignInForm = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        window.alert("Please enter email or password");
        return;
      }
      const data = await login(email, password);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      window.alert(`Login failed: ${error.message}`);
    }
  };
  const handleCancel=()=>{
    setEmail('');
    setPassword('');
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <Button
            variant="text"
            onClick={() => navigate("/register")}
            sx={{ fontStyle: "italic" }}
          >
            Already have an account?
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" fullWidth onClick={handleLogin}>
              Login
            </Button>
            <Button variant="outlined" fullWidth onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SignInForm;
