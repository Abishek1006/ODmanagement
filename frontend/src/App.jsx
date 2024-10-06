import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <div className="main-content">
              <Navbar />
              <div className="content-area">
                <Sidebar />
                <HomePage />
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <div className="main-content">
              <Navbar />
              <div className="content-area">
                <Sidebar />
                <CreatePage />
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;