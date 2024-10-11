import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      {notifications.map(notification => (
        <div key={notification._id} className="notification">
          <p>{notification.message}</p>
          <p>Date: {new Date(notification.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;