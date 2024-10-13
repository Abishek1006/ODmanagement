// src/components/EventSection.jsx
import React, { useEffect, useState } from 'react';
import { getEvents, registerForEvent, requestOD } from '../services/eventservice';
import EventCard from './EventCard';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data.events);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(eventId);
      alert('Successfully registered for the event');
    } catch (error) {
      console.error('Error registering for the event:', error);
    }
  };

  const handleRequestOD = async (eventId) => {
    try {
      await requestOD(eventId);
      alert('OD request sent');
    } catch (error) {
      console.error('Error requesting OD:', error);
    }
  };

  if (loading) return <p>Loading events...</p>;

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
