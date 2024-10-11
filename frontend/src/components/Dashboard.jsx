import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import EventSection from './EventSection';
import ODSection from './ODSection';
import Notifications from './Notifications';
import Profile from './Profile';
import CourseSection from './CourseSection';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="profile" element={<Profile />} />
          {user.role === 'student' && (
            <>
              <Route path="events" element={<EventSection />} />
              <Route path="od" element={<ODSection />} />
            </>
          )}
          {user.role !== 'student' && (
            <>
              <Route path="od" element={<ODSection />} />
              <Route path="courses" element={<CourseSection />} />
            </>
          )}
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;