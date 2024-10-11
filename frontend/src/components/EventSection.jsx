import React, { useState, useEffect } from 'react';
import EventList from './EventList';
import EventDetails from './EventDetails';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await axios.post('/api/events', eventData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setEvents([...events, response.data]);
      setShowEventForm(false);
    } catch (err) {
      setError('Failed to create event');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="event-section">
      {user.role === 'student' && user.isLeader && (
        <button onClick={() => setShowEventForm(true)}>Create New Event</button>
      )}
      {showEventForm && <EventForm onSubmit={createEvent} onCancel={() => setShowEventForm(false)} />}
      <EventList events={events} onSelectEvent={setSelectedEvent} />
      {selectedEvent && <EventDetails event={selectedEvent} />}
    </div>
  );
};

export default EventSection;