import { Routes, Route, BrowserRouter, useNavigate,Link } from "react-router-dom";
import React, { useState} from "react";
import Button from "@mui/material/Button";

const Logout =(props)=>{
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    props.setToken(null);
    navigate("/login");
  };
  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {props.token === null ? (
        <>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{ mr: 2 }}
          >
            Login
          </Button>
          <Button component={Link} to="/register" variant="contained">
            Register
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={handleLogout}> 
          Logout
        </Button>
      )}
    </div>
  );
}

export default Logout;
