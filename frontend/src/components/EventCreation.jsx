import React, { useState } from 'react';
import api from '../services/api';
import '../css/EventCreation.css';  // Add this import

const EventCreation = () => {
  const [eventData, setEventData] = useState({
    name: '',
    prize: '',
    entryFee: '',
    entryType: 'individual',
    imageUrl: '',
    details: '',
    formLink: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/events', eventData);
      alert('Event created successfully!');
      setEventData({
        name: '',
        prize: '',
        entryFee: '',
        entryType: 'individual',
        imageUrl: '',
        details: '',
        formLink: ''
      });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors.join('\n');
        alert(`Event creation failed:\n${errorMessages}`);
      } else {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
      }
    }
  };

  return (
    <div className="event-creation-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name</label>
          <input
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Prize</label>
          <input
            type="text"
            name="prize"
            value={eventData.prize}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Entry Fee</label>
          <input
            type="number"
            name="entryFee"
            value={eventData.entryFee}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Entry Type</label>
          <select
            name="entryType"
            value={eventData.entryType}
            onChange={handleChange}
          >
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>
        </div>
        <div>
          <label>Registration Form Link</label>
          <input
            type="url"
            name="formLink"
            value={eventData.formLink}
            onChange={handleChange}
            placeholder="Enter Google Form or registration link"
            required
          />
        </div>
        <div>
          <label>Image URL (Optional)</label>
          <input
            type="text"
            name="imageUrl"
            value={eventData.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Event Details</label>
          <textarea
            name="details"
            value={eventData.details}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default EventCreation;