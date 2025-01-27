import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaCalendarAlt, FaMoneyBillAlt, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading event details...</p>;

  const handleRegister = () => {
    window.open(event.formLink, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      )}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{event.name}</h1>
      <div className="space-y-2 mt-4">
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <FaMoneyBillAlt className="mr-2" /> Prize: {event.prize}
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <FaMoneyBillAlt className="mr-2" /> Entry Fee: ₹{event.entryFee}
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <FaInfoCircle className="mr-2" /> Type: {event.entryType}
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <FaCalendarAlt className="mr-2" /> Details: {event.details}
        </p>
      </div>
      <button
        onClick={handleRegister}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center"
      >
        <FaExternalLinkAlt className="mr-2" /> Register Now
      </button>
    </div>
  );
};

export default EventDetails;