import { Routes, Route, BrowserRouter } from "react-router-dom";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { register } from "../api/user";

const SignUpForm = () => {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [name,setName] = useState("");

  const handleRegister = async () => {
    try {
      const data = await register(email, password, name); 
      localStorage.setItem("token", data.token);
      console.log("Registration successful:", data);
    } catch (error) {
      window.alert(`Registration failed:: ${error.message}`);
      console.error("Registration failed:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.inputContainer}>
          <div style={styles.inputContainer}>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              fullWidth
              style={styles.textField}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            fullWidth
            style={styles.textField}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={styles.inputContainer}>
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            fullWidth
            style={styles.textField}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={styles.buttonContainer}>
          <Button
            variant="contained"
            style={styles.button}
            onClick={handleRegister}
          >
            Register
          </Button>
          <Button variant="contained" style={styles.button}>
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
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    backgroundColor: "#fff",
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

export default SignUpForm;
