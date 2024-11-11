import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { register } from "../api/user";

const SignUpForm = (props) => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [name,setName] = useState('');
 const navigate = useNavigate();
 const [confirmPassword, setConfirmPassword] = useState("");

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
         window.alert(
           "The passwords does not match. Please try again."
         );
         return;
       }   
      const data = await register(email, password, name); 
      props.setToken(data.token);
      localStorage.setItem("token", data.token);
      console.log("Registration successful:", data);
      navigate("/");
    } catch (error) {
      window.alert(`Registration failed:: ${error.message}`);
      console.error("Registration failed:", error);
    }
  };

  const handleToLogin =()=>{
    navigate("/login");
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.inputContainer}>
          <div style={styles.inputContainer}>
            <TextField
              id="signUpName"
              label="Name"
              variant="outlined"
              fullWidth
              style={styles.textField}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <TextField
            id="signUpEmail"
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
            id="signUpPass"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            style={styles.textField}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div style={styles.inputContainer}>
          <TextField
            id="signUpCompass"
            label="ConfirmPassword"
            variant="outlined"
            type="password"
            fullWidth
            style={styles.textField}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          variant="text"
          style={{ fontStyle: "italic" }}
          onClick={handleToLogin}
        >
          Want to log in?
        </Button>
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

export default SignUpForm;
