// src/components/EventCard.jsx
import "../css/EventCard.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [showODForm, setShowODForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [odData, setODData] = useState({
    dateFrom: '',
    dateTo: '',
    reason: '',
    eventName: event.name
  });
  const [dateError, setDateError] = useState('');

  // Get user roles from the API to determine visibility
  const user = api.getUserRoles();

  // Function to validate date inputs for the OD request
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

  // Function to handle the OD request submission
  const handleRequestOD = async (e) => {
    e.preventDefault();
    if (!validateDates()) return;

    const userDetails = api.getUserDetails();
    
    try {
      await api.post('/od', {
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

  // Function to handle event deletion
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${event._id}`);
        alert('Event deleted successfully');
        window.location.reload(); // Refresh the page to reflect changes
      } catch (error) {
        alert('Error deleting event');
      }
    }
  };

  return (
    <div className="event-card" onClick={() => setShowDetailsModal(true)}>
      {event.imageUrl && <img src={event.imageUrl} alt={event.name} className="event-image" />}
      <div className="event-details">
        <h3>{event.name}</h3>
        <p>Prize: {event.prize}</p>
        <p>Entry Fee: ₹{event.entryFee}</p>
        <p>Type: {event.entryType}</p>

        {(user.isAdmin || user.isLeader) && (
          <button
            className="delete-button"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}

        <button onClick={(e) => {
          e.stopPropagation(); // Prevent card click navigation
          setShowODForm(!showODForm);
        }}>
          Request OD
        </button>

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
                onChange={(e) => setODData({ ...odData, dateFrom: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                name="dateTo"
                value={odData.dateTo}
                onChange={(e) => setODData({ ...odData, dateTo: e.target.value })}
                required
              />
            </div>

            {dateError && <p className="error-message">{dateError}</p>}

            <div className="form-group">
              <label>Reason for OD:</label>
              <textarea
                name="reason"
                value={odData.reason}
                onChange={(e) => setODData({ ...odData, reason: e.target.value })}
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

        {/* Modal for event details */}
        {showDetailsModal && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setShowDetailsModal(false)}>×</button>
              <h2>{event.name}</h2>
              {event.imageUrl && <img src={event.imageUrl} alt={event.name} className="modal-event-image" />}
              <p><strong>Prize:</strong> {event.prize}</p>
              <p><strong>Entry Fee:</strong> ₹{event.entryFee}</p>
              <p><strong>Type:</strong> {event.entryType}</p>
              <p><strong>Details:</strong> {event.details}</p> {/* Full event details */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
