import '../css/EventSection.css';
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/eventservice';
import EventCard from './EventCard';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        console.log('Fetched events:', data); // Debug log
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;
  if (events.length === 0) return <p>No upcoming events found.</p>;

  return (
    <div className="event-section">
      <h2>Upcoming Events</h2>
      <div className="events-grid">
        {events.map((event) => (
          <EventCard 
            key={event._id} 
            event={event}
            showDelete={false}
          />
        ))}
      </div>
    </div>
  );
};

export default EventSection;