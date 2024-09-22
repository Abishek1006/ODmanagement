import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
// import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
          </Routes>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;