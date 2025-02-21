import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminUserManagement from '../components/AdminUserManagement';
import AdminCourseManagement from '../components/AdminCourseManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionChange = (section) => {
    navigate(section);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <nav className="w-64 min-h-screen bg-white shadow-lg">
          <ul className="p-4 space-y-2">
            <li>
              <button
                className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
                  location.pathname === '/admin/users'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-50 text-gray-700'
                }`}
                onClick={() => handleSectionChange('users')}
              >
                User Management
              </button>
            </li>
            <li>
              <button
                className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
                  location.pathname === '/admin/courses'
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-50 text-gray-700'
                }`}
                onClick={() => handleSectionChange('courses')}
              >
                Course Management
              </button>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-8 bg-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="users" replace />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="courses" element={<AdminCourseManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;