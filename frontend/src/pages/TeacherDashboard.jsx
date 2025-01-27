import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import CourseDetailsView from '../components/CourseDetailsView';
import TeacherPersonalDetails from '../components/TeacherPersonalDetails';
import ODApprovalSection from '../components/ODApprovalSection';
import CourseManagement from '../components/CourseManagement';
import EventCreation from '../components/EventCreation';
import RejectedODSection from '../components/RejectedODSection';
import MyEvents from '../components/MyEvents';

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
    return <div className="flex justify-center items-center h-screen bg-orange-50 dark:bg-gray-900">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-orange-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1">
        <nav className="w-64 bg-orange-100 dark:bg-gray-800 p-4 border-r-2 border-orange-300 dark:border-gray-700">
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname === '/teacher/personal-details'
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('personal-details')}
              >
                Personal Details
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname === '/teacher/od-approval'
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('od-approval')}
              >
                OD Approval
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname === '/teacher/courses'
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('courses')}
              >
                Courses
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname === '/teacher/events'
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('events')}
              >
                My Events
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname === '/teacher/create-event'
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('create-event')}
              >
                Create Event
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname === '/teacher/rejected-ods'
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('rejected-ods')}
              >
                Rejected ODs
              </button>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4 bg-white dark:bg-gray-800">
          <Routes>
            <Route path="/" element={<Navigate to="personal-details" replace />} />
            <Route path="personal-details" element={<TeacherPersonalDetails />} />
            <Route path="od-approval" element={<ODApprovalSection />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="courses/:courseId/details" element={<CourseDetailsView />} />
            <Route path="events" element={<MyEvents />} />
            <Route path="create-event" element={<EventCreation />} />
            <Route path="rejected-ods" element={<RejectedODSection />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;