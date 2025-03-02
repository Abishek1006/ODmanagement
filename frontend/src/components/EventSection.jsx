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
        const response = await getEvents();
        if (!response || !response.events) {
          throw new Error('Invalid response format');
        }
        setEvents(response.events);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Failed to load events');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Upcoming Events
      </h2>
      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} showDelete={false} />
          ))}
        </div>
      )}
    </div>
  );
};
export default EventSection;