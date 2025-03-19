import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import CourseDetailsView from '../components/CourseDetailsView';
import TeacherPersonalDetails from '../components/TeacherPersonalDetails';
import ODApprovalSection from '../components/ODApprovalSection';
import CourseManagement from '../components/CourseManagement';
import EventCreation from '../components/EventCreation';
import RejectedODSection from '../components/RejectedODSection';
import MyEvents from '../components/MyEvents';
import SemesterReport from '../components/SemesterReport';

const TeacherDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userRoles = api.getUserRoles();

  // Add logout handler
  const handleLogout = () => {
    api.logout();
    navigate('/'); // Navigate to home/login page
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user-details');
        api.setUserRoles(
          response.data.primaryRole,
          response.data.secondaryRoles || [],
          response.data.isLeader || false
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    const handleScroll = (event) => {
      if (event.deltaX > 50) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('wheel', handleScroll);
    };
  }, []);

  const handleSectionChange = (section) => {
    navigate(section);
    setSidebarOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-orange-50 dark:bg-gray-900">Loading...</div>;
  }

  const menuItems = [
    { path: 'personal-details', label: 'Personal Details' },
    { path: 'od-approval', label: 'OD Requests' },
    { path: 'courses', label: 'Courses' },
    { path: 'events', label: 'My Events' },
    { path: 'create-event', label: 'Create Event' },
    { path: 'rejected-ods', label: 'Rejected ODs' },
    // Only show semester report for tutors
    ...(userRoles.primaryRole === 'tutor' ? [{ path: 'semester-report', label: 'Semester Report' }] : [])
  ];

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar Toggle Button for Mobile */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-orange-600 dark:text-orange-400">
            {sidebarOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Sidebar */}
        <nav
          ref={sidebarRef}
          className={`fixed lg:static top-0 left-0 w-64 h-full bg-orange-100 dark:bg-gray-800 p-4 border-r-2 border-orange-300 dark:border-gray-700 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:z-auto`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-orange-600 dark:text-orange-400 mb-6"
          >
            <X size={30} />
          </button>
          
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`w-full text-left p-2 rounded-lg ${
                    location.pathname === `/teacher/${item.path}`
                      ? 'bg-orange-500 text-white dark:bg-orange-600'
                      : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleSectionChange(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
            
            {/* Add Logout Button */}
            <li className="mt-auto pt-4 border-t border-orange-200 dark:border-gray-700">
              <button
                className="w-full text-left p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 flex items-center"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-white dark:bg-gray-800">
          <Routes>
            <Route path="/" element={<Navigate to="personal-details" replace />} />
            <Route path="personal-details" element={<TeacherPersonalDetails />} />
            <Route path="od-approval" element={<ODApprovalSection />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="courses/:courseId/details" element={<CourseDetailsView />} />
            <Route path="events" element={<MyEvents userType="teacher" />} />
            <Route path="create-event" element={<EventCreation />} />
            <Route path="rejected-ods" element={<RejectedODSection />} />
            <Route path="semester-report" element={<SemesterReport />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
export default TeacherDashboard;