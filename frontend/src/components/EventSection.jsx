
// src/components/EventSection.jsx
import React, { useEffect, useState } from 'react';
import { getEvents, registerForEvent, requestOD } from '../services/eventservice';
import EventCard from './EventCard';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(eventId);
      alert('Successfully registered for the event');
      // Optionally, refresh the events list here
    } catch (error) {
      console.error('Error registering for the event:', error);
      alert('Failed to register for the event. Please try again.');
    }
  };

  const handleRequestOD = async (eventId) => {
    try {
      await requestOD(eventId);
      alert('OD request sent');
    } catch (error) {
      console.error('Error requesting OD:', error);
      alert('Failed to request OD. Please try again.');
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onRegister={handleRegister}
            onRequestOD={handleRequestOD}
          />
        ))}
      </div>
    </div>
  );
};

export default EventSection;