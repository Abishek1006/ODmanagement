import React from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EventList = ({ events, onSelectEvent }) => {
  const { user } = useAuth();

  const applyOD = async (eventId) => {
    try {
      await axios.post('/api/od-requests', { eventId }, {
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
    <div className="event-list">
      {events.map(event => (
        <div key={event._id} className="event-item">
          <h3>{event.name}</h3>
          <button onClick={() => onSelectEvent(event)}>View Details</button>
          <button onClick={() => applyOD(event._id)}>Apply OD</button>
        </div>
      ))}
    </div>
  );
};

export default EventList;