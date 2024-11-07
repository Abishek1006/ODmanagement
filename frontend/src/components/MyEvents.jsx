import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/MyEvents.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const fetchCreatedEvents = async () => {
      try {
        const response = await api.get('/my-created-events');
        console.log('Full API Response:', response);
        const eventsData = Array.isArray(response.data) ? response.data : response.data.events;
        setEvents(eventsData || []);
      } catch (error) {
        console.log('Full error object:', error.response || error);
        alert('Failed to fetch created events');
      }
    };

    fetchCreatedEvents();
  }, []);

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/events/${editingEvent._id}`, editingEvent);
      setEvents(events.map(event => 
        event._id === response.data._id ? response.data : event
      ));
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter(event => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const renderEventList = () => {
    return events.map(event => (
      <div key={event._id} className="event-card">
        <h3>{event.name}</h3>
        <p>Prize: {event.prize}</p>
        <p>Entry Fee: {event.entryFee}</p>
        <div className="event-actions">
          <button onClick={() => handleEdit(event)}>Edit</button>
          <button onClick={() => handleDelete(event._id)}>Delete</button>
        </div>
      </div>
    ));
  };

  const renderEditForm = () => {
    if (!editingEvent) return null;

    return (
      <div className="edit-event-modal">
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={editingEvent.name}
            onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
            required
          />
          <input
            type="text"
            value={editingEvent.prize}
            onChange={(e) => setEditingEvent({...editingEvent, prize: e.target.value})}
            required
          />
          <input
            type="number"
            value={editingEvent.entryFee}
            onChange={(e) => setEditingEvent({...editingEvent, entryFee: e.target.value})}
            required
          />
          <button type="submit">Update Event</button>
          <button type="button" onClick={() => setEditingEvent(null)}>Cancel</button>
        </form>
      </div>
    );
  };

  return (
    <div className="my-events-container">
      <h2>My Created Events</h2>
      {renderEventList()}
      {renderEditForm()}
    </div>
  );
};

export default MyEvents;
