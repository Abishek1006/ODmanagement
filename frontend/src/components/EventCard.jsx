// src/components/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onRegister, onRequestOD }) => {
  const navigate = useNavigate();

  const handleRegister = async (eventId) => {
    try {
      await onRegister(eventId); // Registering for the event
      navigate('/student-dashboard'); // Optional: redirect after registration
    } catch (error) {
      console.error('Error during event registration:', error);
    }
  };

  const handleRequestOD = async (eventId) => {
    try {
      await onRequestOD(eventId); // Requesting OD for the event
      navigate('/student-dashboard/od-section'); // Optional: redirect to OD section after request
    } catch (error) {
      console.error('Error requesting OD:', error);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4 m-4">
      <h3 className="text-xl font-bold">{event.name}</h3>
      <p className="text-gray-700">Prize: {event.prize}</p>
      <p className="text-gray-700">Entry Fee: {event.entryFee}</p>
      <p className="text-gray-700">Type: {event.entryType}</p>
      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => handleRegister(event._id)}
        >
          Register
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-4"
          onClick={() => handleRequestOD(event._id)}
        >
          Request OD
        </button>
      </div>
    </div>
  );
};

export default EventCard;
