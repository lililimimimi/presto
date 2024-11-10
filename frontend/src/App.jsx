import { useState } from 'react';
import{Routes, Route, BrowserRouter} from 'react-router-dom';
import SignInForm from './components/SigninForm';
import SignUpForm from './components/SignUpForm';


function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/SignInForm" element={<SignInForm />}></Route>
          <Route path="/" element={<SignUpForm />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
