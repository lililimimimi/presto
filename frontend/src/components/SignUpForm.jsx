import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Container, Paper, Stack } from "@mui/material";
import { register } from "../api/data";

const SignUpForm = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Handle user registration
  const handleRegister = async () => {
    try {
      if (!email) {
        window.alert("Please enter your email");
        return;
      }
      if (!password) {
        window.alert("Please enter your password");
        return;
      }
      if (!confirmPassword) {
        window.alert("Please confirm your password");
        return;
      }
      if (password !== confirmPassword) {
        window.alert("The passwords does not match. Please try again.");
        return;
      }
      const data = await register(email, password, name);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      window.alert(`Registration failed: ${error.message}`);
    }
  };
  
  // Handle cancel button logic
  const handleCancel = () => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
  };

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
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />

          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />

          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{ fontStyle: "italic" }}
          >
            Want to log in?
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" fullWidth onClick={handleRegister}>
              Register
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

export default SignUpForm;
