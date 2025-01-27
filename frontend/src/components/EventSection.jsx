import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/eventservice';
import EventCard from './EventCard';
import { FaSpinner } from 'react-icons/fa';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (events.length === 0) return <p className="text-center text-gray-700 dark:text-gray-300">No upcoming events found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} showDelete={false} />
        ))}
      </div>
    </div>
  );
};

export default EventSection;