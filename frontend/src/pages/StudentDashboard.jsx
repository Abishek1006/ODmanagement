import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import EventSection from '../components/EventSection';
import PersonalDetails from '../components/PersonalDetails';
import ODSection from '../components/ODsection';
import ODHistory from '../components/ODHistory';
import EventCreation from '../components/EventCreation';
import MyEvents from '../components/MyEvents';
import ExternalODSection from '../components/ExternalODSection';

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState(api.getUserRoles());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get isLeader status from user roles
  const canAccessMyEvents = userRoles.isLeader;

  const menuItems = [ 
    { path: 'events', label: 'Events' },
    // Only show My Events to leaders
    ...(canAccessMyEvents ? [{ path: 'my-events', label: 'My Events' }] : []),
    { path: 'personal-details', label: 'Personal Details' },
    { path: 'od-section', label: 'OD Section' },
    { path: 'od-history', label: 'OD History' },
    { path: 'external-od', label: 'External OD' },
    ...(canAccessMyEvents ? [{ path: 'create-event', label: 'Create Event' }] : [])
  ];

  const handleSectionChange = (section) => {
    navigate(section);
    setSidebarOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-orange-50 dark:bg-gray-900">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1">
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-orange-600 dark:text-orange-400">
            {sidebarOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        <nav
          ref={sidebarRef}
          className={`fixed lg:static top-0 left-0 w-64 h-full bg-orange-100 dark:bg-gray-800 p-4 border-r-2 border-orange-300 dark:border-gray-700 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:z-auto`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-orange-600 dark:text-orange-400"
          >
            <X size={30} />
          </button>
          <ul className="space-y-2 mt-10">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`w-full text-left p-2 rounded-lg ${
                    location.pathname === `/student/${item.path}`
                      ? 'bg-orange-500 text-white dark:bg-orange-600'
                      : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleSectionChange(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 p-4 bg-white dark:bg-gray-800">
          <Routes>
            <Route path="/" element={<Navigate to="events" replace />} />
            <Route path="events" element={<EventSection />} />
            <Route path="my-events" element={<MyEvents />} />
            <Route path="personal-details" element={<PersonalDetails />} />
            <Route path="od-section" element={<ODSection />} />
            <Route path="od-history" element={<ODHistory />} />
            <Route path="external-od" element={<ExternalODSection />} />
            <Route path="create-event" element={<EventCreation />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
export default StudentDashboard;
