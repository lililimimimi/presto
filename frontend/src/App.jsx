import { useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate} from "react-router-dom";
import SignInForm from './components/SigninForm';
import SignUpForm from './components/SignUpForm';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';


function App() {
  const [token,setToken] = useState(localStorage.getItem('token'));
  return (
    <>
      <BrowserRouter>
        <Logout token={token} setToken={setToken} />
        <Routes>
          <Route path="/" element={token ? null : <Navigate to="/login" />} />
          <Route
            path="/login"
            element={<SignInForm setToken={setToken} />}
          ></Route>
          <Route
            path="/register"
            element={<SignUpForm setToken={setToken} />}
          ></Route>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
