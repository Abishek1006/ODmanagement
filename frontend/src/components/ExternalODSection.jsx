import React, { useState } from 'react';
import api from '../services/api';
import '../css/ODSection.css';

const ExternalODSection = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    dateFrom: '',
    dateTo: '',
    reason: '',
    location: '',
    eventType: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/od/external', formData);
      console.log('Response:', response.data);
      setSubmitted(true);
      setFormData({
        eventName: '',
        dateFrom: '',
        dateTo: '',
        reason: '',
        location: '',
        eventType: ''
      });
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="od-section">
      <h2>External OD Request Form</h2>
      {submitted && (
        <div className="success-message">
          External OD request submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="od-form">
        <div className="form-group">
          <label>Event/Activity Name:</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Enter event or activity name"
            required
          />
        </div>

        <div className="form-group">
          <label>Event Type:</label>
          <input
            type="text"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            placeholder="e.g., Competition, Workshop, Internship, etc."
            required
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
          />
        </div>

        <div className="form-group">
          <label>From Date:</label>
          <input
            type="date"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>To Date:</label>
          <input
            type="date"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason/Description:</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Provide detailed reason for the OD request"
            required
            rows="4"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit External OD Request
        </button>
      </form>
    </div>
  );
};

export default ExternalODSection;