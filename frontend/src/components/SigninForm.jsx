import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const SignInForm = () => {
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.inputContainer}>
          <div>Email:</div>
          <TextField
            id="outlined-basic"
            label="email"
            variant="outlined"
            fullWidth
            style={styles.textField}
          />
        </div>
        <div style={styles.inputContainer}>
          <div>Password:</div>
          <TextField
            id="outlined-basic"
            label="password"
            variant="outlined"
            fullWidth
            style={styles.textField}
          />
        </div>
        <div style={styles.buttonContainer}>
          <Button variant="contained" style={styles.button}>
            Login
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

export default SignInForm;
