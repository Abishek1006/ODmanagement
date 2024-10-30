// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventSection from '../components/EventSection';
import api from '../services/api';
import { Routes, Route, useNavigate } from 'react-router-dom';

  const StudentDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userRoles, setUserRoles] = useState(api.getUserRoles());
    const navigate = useNavigate();

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

    const handleSectionChange = (section) => {
      navigate(`/student-dashboard/${section}`);
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
              <li>
                <button onClick={() => handleSectionChange('events')}>Events</button>
              </li>
              <li>
                <button onClick={() => handleSectionChange('personaldetails')}>Personal Details</button>
              </li>
              <li>
                <button onClick={() => handleSectionChange('odsection')}>OD Section</button>
              </li>
              {canCreateEvent && (
                <li>
                  <button onClick={() => handleSectionChange('createevent')}>Create Event</button>
                </li>
              )}
            </ul>
          </nav>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<EventSection />} />
              <Route path="/events" element={<EventSection />} />
              <Route path="/personaldetails" element={<PersonalDetails />} />
              <Route path="/odsection" element={<ODSection />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  };

export default StudentDashboard;