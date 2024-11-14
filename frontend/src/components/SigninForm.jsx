import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { login } from "../api/data";

const SignInForm = (props) => {
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
      console.log("Login successful:", data);
      props.setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      window.alert(`Login failed: ${error.message}`);
      console.error("Login failed:", error);
    }
  };

  const handleToRegister = () => {
    navigate("/register");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.inputContainer}>
          <TextField
            id="loginEmail"
            label="Email"
            variant="outlined"
            fullWidth
            style={styles.textField}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div style={styles.inputContainer}>
          <TextField
            id="loginPass"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            style={styles.textField}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          variant="text"
          style={{ fontStyle: "italic" }}
          onClick={handleToRegister}
        >
          Already have an account?
        </Button>
        <div style={styles.buttonContainer}>
          <Button
            variant="contained"
            style={styles.button}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button variant="outlined" style={styles.button}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  inputContainer: {
    marginBottom: "20px",
  },
  textField: {
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  button: {
    flexGrow: 1,
  },
};

export default SignInForm;
