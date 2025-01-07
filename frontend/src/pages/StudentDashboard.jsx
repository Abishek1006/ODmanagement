import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation , Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventSection from '../components/EventSection';
import PersonalDetails from '../components/PersonalDetails';
import ODSection from '../components/ODsection';
import api from '../services/api';
import '../css/EventCard.css';
import '../css/EventSection.css';
import '../css/PersonalDetails.css';
import '../css/ODSection.css';
import '../css/student.css';
import EventCreation from '../components/EventCreation';
import MyEvents from '../components/MyEvents';
import ExternalODSection from '../components/ExternalODSection';
const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState(api.getUserRoles());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user-details');
        api.setUserDetails(response.data); // Set user details first
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
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <nav className="sidebar">
          <ul>
            <li>
              <button 
                className={location.pathname === '/student/events' ? 'active' : ''} 
                onClick={() => handleSectionChange('events')}
              >
                Events
              </button>
            </li>
            <li>
              <button 
                className={location.pathname === '/student/my-events' ? 'active' : ''} 
                onClick={() => handleSectionChange('my-events')}
              >
                My Events
              </button>
            </li>
            <li>
              <button
                className={location.pathname.includes('personal-details') ? 'active' : ''}
                onClick={() => handleSectionChange('personal-details')}
              >
                Personal Details
              </button>
            </li>
            <li>
              <button
                className={location.pathname.includes('od-section') ? 'active' : ''}
                onClick={() => handleSectionChange('od-section')}
              >
                OD Section
              </button>
            </li>
            <li>
              <button
                className={location.pathname.includes('external-od') ? 'active' : ''}
                onClick={() => handleSectionChange('external-od')}
              >
                External OD
              </button>
            </li>
            {canCreateEvent && (
              <li>
                <button
                  className={location.pathname.includes('create-event') ? 'active' : ''}
                  onClick={() => handleSectionChange('create-event')}
                >
                  Create Event abdjkhaskhska
                </button>
              </li>
            )}
          </ul>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="events" replace />} />
            <Route path="events" element={<EventSection />} />
            <Route path="my-events" element={<MyEvents />} />
            <Route path="personal-details" element={<PersonalDetails />} />
            <Route path="od-section" element={<ODSection />} />
            <Route path="external-od" element={<ExternalODSection />} />
            <Route path="create-event" element={<EventCreation />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};


export default StudentDashboard;
