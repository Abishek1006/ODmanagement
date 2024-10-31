// src/components/EventCard.jsx
import "../css/EventCard.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [showODForm, setShowODForm] = useState(false);
  const [odData, setODData] = useState({
    dateFrom: '',
    dateTo: '',
    reason: '',
    eventName: event.name
  });
  const [dateError, setDateError] = useState('');

  const validateDates = () => {
    const fromDate = new Date(odData.dateFrom);
    const toDate = new Date(odData.dateTo);
    const today = new Date();

    if (fromDate < today) {
      setDateError('Start date cannot be in the past');
      return false;
    }
    if (toDate < fromDate) {
      setDateError('End date must be after start date');
      return false;
    }
    if ((toDate - fromDate) / (1000 * 60 * 60 * 24) > 7) {
      setDateError('OD duration cannot exceed 7 days');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleRequestOD = async (e) => {
    e.preventDefault();
    if (!validateDates()) return;

    const userDetails = api.getUserDetails();
    
    try {
      const response = await api.post('/od', {
        studentId: userDetails._id,
        eventName: event.name,
        dateFrom: odData.dateFrom,
        dateTo: odData.dateTo,
        reason: odData.reason,
        tutorId: userDetails.tutorId,
        acId: userDetails.acId,
        hodId: userDetails.hodId
      });
      setShowODForm(false);
      alert('OD request submitted successfully');
    } catch (error) {
      alert('Failed to submit OD request');
    }
  };

  return (
    <div className="event-card">
      <div className="event-details">
        <h3>{event.name}</h3>
        <p>Prize: {event.prize}</p>
        <p>Entry Fee: ₹{event.entryFee}</p>
        <p>Type: {event.entryType}</p>
        
        <button onClick={() => setShowODForm(!showODForm)}>Request OD</button>

        {showODForm && (
          <form onSubmit={handleRequestOD} className="od-form">
            <div className="event-summary">
              <h4>Event Details</h4>
              <p>Event Name: {event.name}</p>
              <p>Entry Type: {event.entryType}</p>
            </div>

            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                name="dateFrom"
                value={odData.dateFrom}
                onChange={(e) => setODData({...odData, dateFrom: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                name="dateTo"
                value={odData.dateTo}
                onChange={(e) => setODData({...odData, dateTo: e.target.value})}
                required
              />
            </div>

            {dateError && <p className="error-message">{dateError}</p>}

            <div className="form-group">
              <label>Reason for OD:</label>
              <textarea
                name="reason"
                value={odData.reason}
                onChange={(e) => setODData({...odData, reason: e.target.value})}
                placeholder="Provide detailed reason for OD request"
                required
                minLength="10"
                maxLength="500"
              />
            </div>

            <div className="form-actions">
              <button type="submit">Submit OD Request</button>
              <button type="button" onClick={() => setShowODForm(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventCard;
