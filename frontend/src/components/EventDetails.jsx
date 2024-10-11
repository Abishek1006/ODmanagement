import React from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EventDetails = ({ event }) => {
  const { user } = useAuth();

  const applyOD = async () => {
    try {
      await axios.post('/api/od-requests', { eventId: event._id }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      alert('OD request submitted successfully');
    } catch (err) {
      alert('Failed to submit OD request');
    }
  };

  return (
    <div className="event-details">
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <button onClick={applyOD}>Apply OD</button>
    </div>
  );
};

export default EventDetails;
