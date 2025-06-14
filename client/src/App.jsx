import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import Resetpassword from './pages/Resetpassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/DashBoard.jsx';
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/email-verify" element={<EmailVerify/>}/>
          <Route path="/reset-password" element={<Resetpassword/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </div>
  )
}

export default App;
