import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/MyEvents.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCreatedEvents = async () => {
      try {
        const response = await api.get('/events/my-created-events');
        const eventsData = Array.isArray(response.data) ? response.data : response.data.events;
        setEvents(eventsData || []);
      } catch (err) {
        console.error('Error fetching created events:', err);
        setError('Failed to fetch created events. Please try again later.');
      } finally {
        setLoading(false);
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
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === response.data._id ? response.data : event
        )
      );
      setEditingEvent(null);
      alert('Event updated successfully.');
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update the event. Please try again.');
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        alert('Event deleted successfully.');
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete the event. Please try again.');
      }
    }
  };

  const renderEventList = () => {
    if (loading) return <p>Loading your events...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (events.length === 0) return <p className="empty-message">You have not created any events yet.</p>;

    return events.map((event) => (
      <div key={event._id} className="event-card">
        <h3>{event.name}</h3>
        <p>Prize: {event.prize || 'N/A'}</p>
        <p>Entry Fee: {event.entryFee || 'Free'}</p>
        <div className="event-actions">
          <button className="edit-button" onClick={() => handleEdit(event)}>Edit</button>
          <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>
        </div>
      </div>
    ));
  };

  const renderEditForm = () => {
    if (!editingEvent) return null;

    return (
      <div className="edit-event-modal">
        <form onSubmit={handleUpdate}>
          <label>
            Event Name:
            <input
              type="text"
              value={editingEvent.name}
              onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
              placeholder="Enter event name"
              required
            />
          </label>
          <label>
            Prize:
            <input
              type="text"
              value={editingEvent.prize}
              onChange={(e) => setEditingEvent({ ...editingEvent, prize: e.target.value })}
              placeholder="Enter prize"
              required
            />
          </label>
          <label>
            Entry Fee:
            <input
              type="number"
              value={editingEvent.entryFee}
              onChange={(e) => setEditingEvent({ ...editingEvent, entryFee: e.target.value })}
              placeholder="Enter entry fee"
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="update-button">Update Event</button>
            <button type="button" className="cancel-button" onClick={() => setEditingEvent(null)}>Cancel</button>
          </div>
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
