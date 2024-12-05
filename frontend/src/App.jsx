import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Signup } from "./components/Signup";
import { Signin } from "./components/Signin";
import { Send } from "./components/Send";
import { Dashboard } from "./components/Dashboard";
import { Fragment, useEffect } from "react";


function App() {

  const isAuthenticated = localStorage.getItem('token');



  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/send" element={<Send />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
    
  )
}

export default App
