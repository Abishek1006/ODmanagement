// src/components/EventCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerForEvent, requestOD } from '../services/eventservice';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [showODForm, setShowODForm] = useState(false);
  const [odData, setODData] = useState({
    dateFrom: '',
    dateTo: '',
    reason: ''
  });

  const handleRegister = async () => {
    try {
      await registerForEvent(event._id);
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Error during event registration:', error);
    }
  };

  const handleRequestOD = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/od', {
        ...odData,
        eventId: event._id
      });
      setShowODForm(false);
      alert('OD request submitted successfully');
    } catch (error) {
      alert('Failed to submit OD request');
    }
  };

  const handleODInputChange = (e) => {
    setODData({ ...odData, [e.target.name]: e.target.value });
  };

  return (
    <div className="event-card">
      <img src={event.imageUrl || 'default-event-image.jpg'} alt={event.name} />
      <div className="event-details">
        <h3>{event.name}</h3>
        <p>Prize: {event.prize}</p>
        <p>Entry Fee: ₹{event.entryFee}</p>
        <p>Type: {event.entryType}</p>
        <div className="event-actions">
          <button onClick={() => handleRegister(event._id)}>Register</button>
          <button onClick={() => setShowODForm(!showODForm)}>Request OD</button>
        </div>
        {showODForm && (
          <form onSubmit={handleRequestOD} className="od-form">
            <input
              type="date"
              name="dateFrom"
              value={odData.dateFrom}
              onChange={(e) => setODData({...odData, dateFrom: e.target.value})}
              required
            />
            <input
              type="date"
              name="dateTo"
              value={odData.dateTo}
              onChange={(e) => setODData({...odData, dateTo: e.target.value})}
              required
            />
            <textarea
              name="reason"
              value={odData.reason}
              onChange={(e) => setODData({...odData, reason: e.target.value})}
              required
            />
            <button type="submit">Submit OD Request</button>
          </form>
        )}
      </div>
    </div>
  );
};export default EventCard;
