import AuthPage from "@pages/AuthPage";
import Login from "@pages/Login";
import Register from "@pages/Register";
import HomePage from "@pages/HomePage";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Routers = () => {
  const { token } = useAuth();
  
  // defining routes
  return (
    <>
      <Routes>
        <Route path="/" element={!token ? <Navigate replace to="/login"/> : <HomePage />} />
        <Route path="/login" element={token ? <Navigate replace to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate replace to="/" /> : <Register />} />
      </Routes>
    </>
  );
};

export default Routers;
