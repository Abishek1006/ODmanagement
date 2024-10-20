// src/components/EventCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerForEvent, requestOD } from '../services/eventservice';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [showODForm, setShowODForm] = useState(false);
  const [odData, setODData] = useState({
    dateFrom: '',
    dateTo: '',
    reason: ''
  });

  const handleRegister = async () => {
    try {
      await registerForEvent(event._id);
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Error during event registration:', error);
    }
  };

  const handleRequestOD = async (e) => {
    e.preventDefault();
    try {
      await requestOD(event._id, odData);
      setShowODForm(false);
      navigate('/student-dashboard/od-section');
    } catch (error) {
      console.error('Error requesting OD:', error);
    }
  };

  const handleODInputChange = (e) => {
    setODData({ ...odData, [e.target.name]: e.target.value });
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
          onClick={handleRegister}
        >
          Register
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-4"
          onClick={() => setShowODForm(!showODForm)}
        >
          Request OD
        </button>
      </div>
      {showODForm && (
        <form onSubmit={handleRequestOD} className="mt-4">
          <input
            type="date"
            name="dateFrom"
            value={odData.dateFrom}
            onChange={handleODInputChange}
            required
          />
          <input
            type="date"
            name="dateTo"
            value={odData.dateTo}
            onChange={handleODInputChange}
            required
          />
          <textarea
            name="reason"
            value={odData.reason}
            onChange={handleODInputChange}
            placeholder="Reason for OD"
            required
          />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
            Submit OD Request
          </button>
        </form>
      )}
    </div>
  );
};

export default EventCard;
