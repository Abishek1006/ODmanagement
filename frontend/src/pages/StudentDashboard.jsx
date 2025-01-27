import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventSection from '../components/EventSection';
import PersonalDetails from '../components/PersonalDetails';
import ODSection from '../components/ODsection';
import ODHistory from '../components/ODHistory';
import api from '../services/api';
import EventCreation from '../components/EventCreation';
import MyEvents from '../components/MyEvents';
import ExternalODSection from '../components/ExternalODSection';

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState(api.getUserRoles());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user-details');
        api.setUserDetails(response.data);
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

  const canCreateEvent = userRoles.isLeader;

  const handleSectionChange = (section) => {
    navigate(section);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <nav className={`fixed md:relative z-40 w-64 bg-orange-100 dark:bg-gray-800 p-4 border-r-2 border-orange-300 dark:border-gray-700 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname === '/student/events'
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('events')}
              >
                Events
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname === '/student/my-events'
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('my-events')}
              >
                My Events
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname.includes('personal-details')
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
                  location.pathname.includes('od-section')
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('od-section')}
              >
                OD Section
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname.includes('od-history')
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('od-history')}
              >
                OD History
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded-lg ${
                  location.pathname.includes('external-od')
                    ? 'bg-orange-500 text-white dark:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSectionChange('external-od')}
              >
                External OD
              </button>
            </li>
            {canCreateEvent && (
              <li>
                <button
                  className={`w-full text-left p-2 rounded-lg ${
                    location.pathname.includes('create-event')
                      ? 'bg-orange-500 text-white dark:bg-orange-600'
                      : 'bg-white text-orange-500 hover:bg-orange-100 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleSectionChange('create-event')}
                >
                  Create Event
                </button>
              </li>
            )}
          </ul>
        </nav>
        {/* Main Content */}
        <main className="flex-1 p-4 bg-white dark:bg-gray-800">
          <button
            className="md:hidden p-2 bg-orange-500 text-white rounded-lg mb-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
          </button>
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