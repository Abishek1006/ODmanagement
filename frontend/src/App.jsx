// src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
