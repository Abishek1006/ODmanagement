import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/dashboard/profile">Profile</Link></li>
        {user.role === 'student' && (
          <>
            <li><Link to="/dashboard/events">Events</Link></li>
            <li><Link to="/dashboard/od">OD Requests</Link></li>
          </>
        )}
        {user.role !== 'student' && (
          <>
            <li><Link to="/dashboard/od">Approve OD Requests</Link></li>
            <li><Link to="/dashboard/courses">Courses</Link></li>
          </>
        )}
        <li><Link to="/dashboard/notifications">Notifications</Link></li>
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Sidebar;