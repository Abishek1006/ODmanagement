import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventSection from '../components/EventSection';
import PersonalDetails from '../components/PersonalDetails';
import ODSection from '../components/ODSection';
import CreateEvent from '../components/CreateEvent';
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
        return <PersonalDetails />;
      case 'od':
        return <ODSection />;
      case 'createevent':
        return <CreateEvent />;
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

export default StudentDashboard;
