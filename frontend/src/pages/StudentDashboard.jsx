// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventSection from '../components/EventSection';
import '../css/student.css';
import api from '../services/api';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('events');
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState(api.getUserRoles());

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user-details');
        console.log('Full user details response:', response.data);
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

  const canCreateEvent = 
    userRoles.primaryRole === 'student' ? userRoles.isLeader : 
    ['teacher', 'tutor', 'ac', 'hod'].includes(userRoles.primaryRole) || 
    userRoles.secondaryRoles.some(role => ['teacher', 'tutor', 'ac', 'hod'].includes(role));

  console.log('User Role:', userRoles.primaryRole);
  console.log('Secondary Roles:', userRoles.secondaryRoles);
  console.log('Is Leader:', userRoles.isLeader);
  console.log('Can Create Event:', canCreateEvent);

  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <EventSection />;
      case 'details':
        return <PersonalDetailsContent />;
      case 'od':
        return <ODSectionContent />;
      case 'createevent':
        return <CreateEventContent />;
      default:
        return <EventSection />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <nav className="sidebar">
          <ul>
            {['Events', 'Personal Details', 'OD Section'].map((item) => (
              <li key={item}>
                <button
                  className={`sidebar-button ${
                    activeSection === item.toLowerCase().replace(' ', '')
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => setActiveSection(item.toLowerCase().replace(' ', ''))}
                >
                  {item}
                </button>
              </li>
            ))}
            {canCreateEvent && (
              <li>
                <button
                  className={`sidebar-button ${activeSection === 'createevent' ? 'active' : ''}`}
                  onClick={() => setActiveSection('createevent')}
                >
                  Create Event
                </button>
              </li>
            )}
          </ul>
        </nav>
        <main className="main-content">
          <h2 className="section-title">
            {activeSection.replace('od', 'OD').replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const PersonalDetailsContent = () => (
  <div className="content-card">
    <h3>Personal Information</h3>
    {/* Add personal details content here */}
  </div>
);

const ODSectionContent = () => (
  <div className="content-card">
    <h3>On Duty Section</h3>
    {/* Add OD section content here */}
  </div>
);

const CreateEventContent = () => (
  <div className="content-card">
    <h3>Create Event</h3>
    {/* Add create event content here */}
  </div>
);

export default StudentDashboard;