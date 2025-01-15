import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import CourseDetailsView from '../components/CourseDetailsView';
import TeacherPersonalDetails from '../components/TeacherPersonalDetails';
import ODApprovalSection from '../components/ODApprovalSection';
import CourseManagement from '../components/CourseManagement';
import MyEvents from '../components/MyEvents'; // Reuse existing events component
import '../css/teacher.css'; // Create a separate CSS file for teacher dashboard

const TeacherDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState(api.getUserRoles());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user-details');
        api.setUserRoles(
          response.data.primaryRole,
          response.data.secondaryRoles || [],
          response.data.isLeader || false
        );
        setUserRoles(api.getUserRoles());
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSectionChange = (section) => {
    navigate(section);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard teacher-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <nav className="sidebar">
          <ul>
            <li>
              <button 
                className={location.pathname === '/teacher/personal-details' ? 'active' : ''} 
                onClick={() => handleSectionChange('personal-details')}
              >
                Personal Details
              </button>
            </li>
            <li>
              <button 
                className={location.pathname === '/teacher/od-approval' ? 'active' : ''} 
                onClick={() => handleSectionChange('od-approval')}
              >
                OD Approval
              </button>
            </li>
            <li>
              <button
                className={location.pathname === '/teacher/courses' ? 'active' : ''}
                onClick={() => handleSectionChange('courses')}
              >
                Courses
              </button>
            </li>
            <li>
              <button
                className={location.pathname === '/teacher/events' ? 'active' : ''}
                onClick={() => handleSectionChange('events')}
              >
                My Events
              </button>
            </li>
          </ul>
        </nav>
        <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="personal-details" replace />} />
              <Route path="personal-details" element={<TeacherPersonalDetails />} />
              <Route path="od-approval" element={<ODApprovalSection />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="courses/:courseId/details" element={<CourseDetailsView />} />
              {/* it is using course.controller to fetch students with od not the api in od.controller(we should remove the one from od.controller) */}
              <Route path="events" element={<MyEvents />} />
            </Routes>
        </main>
      </div>
    </div>
  );
};
export default TeacherDashboard;
