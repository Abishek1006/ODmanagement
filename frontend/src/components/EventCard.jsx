import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { requestOD } from '../services/eventservice';
import { FaTrash, FaCalendarAlt, FaInfoCircle, FaExternalLinkAlt, FaRegCalendarCheck, FaImage } from 'react-icons/fa';

const EventCard = ({ event, showDelete = false }) => {
  const navigate = useNavigate();
  const [showODForm, setShowODForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [odData, setODData] = useState({
    dateFrom: '',
    dateTo: '',
    reason: '',
    eventName: event.name,
  });
  const [dateError, setDateError] = useState('');
  const user = api.getUserRoles();

  const validateDates = () => {
    const fromDate = new Date(odData.dateFrom);
    const toDate = new Date(odData.dateTo);
    const today = new Date();

    if (fromDate < today) {
      setDateError('Start date cannot be in the past');
      return false;
    }
    if (toDate < fromDate) {
      setDateError('End date must be after start date');
      return false;
    }
    if ((toDate - fromDate) / (1000 * 60 * 60 * 24) > 7) {
      setDateError('OD duration cannot exceed 7 days');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleRequestOD = async (e) => {
    e.preventDefault();
    if (!validateDates()) return;

    try {
      const response = await requestOD({
        eventName: event.name,
        dateFrom: odData.dateFrom,
        dateTo: odData.dateTo,
        reason: odData.reason,
        isExternal: false,
        location: event.location || '',
        eventType: event.type || '',
      });
      setShowODForm(false);
      alert('OD request submitted successfully');
    } catch (error) {
      alert('Failed to submit OD request');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${event._id}`);
        alert('Event deleted successfully');
        window.location.reload();
      } catch (error) {
        alert('Error deleting event');
      }
    }
  };

  const handleRegister = () => {
    window.open(event.formLink, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-2 border-gray-900 dark:border-gray-600">
      {event.image && !imageError ? (
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={() => {
            console.error('Failed to load event image');
            setImageError(true);
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
          <FaImage className="text-gray-400 text-4xl" />
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.name}</h3>
      <div className="space-y-2 mt-2">
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <FaRegCalendarCheck className="mr-2" /> Prize: {event.prize}
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <FaRegCalendarCheck className="mr-2" /> Entry Fee: ₹{event.entryFee}
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-center">
          <FaRegCalendarCheck className="mr-2" /> Type: {event.entryType}
        </p>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleRegister}
          className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
        >
          <FaExternalLinkAlt className="mr-2" /> Register Now
        </button>
        {showDelete && (user.isAdmin || user.isLeader) && (
          <button
            onClick={handleDelete}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowODForm(!showODForm);
          }}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <FaCalendarAlt className="mr-2" /> Request OD
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetailsModal(true);
          }}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          <FaInfoCircle className="mr-2" /> View Details
        </button>
      </div>

      {showODForm && (
        <form onSubmit={handleRequestOD} className="mt-4 space-y-4">
          <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Event Details</h4>
            <p className="text-gray-700 dark:text-gray-300">Event Name: {event.name}</p>
            <p className="text-gray-700 dark:text-gray-300">Entry Type: {event.entryType}</p>
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300">Start Date:</label>
            <input
              type="date"
              name="dateFrom"
              value={odData.dateFrom}
              onChange={(e) => setODData({ ...odData, dateFrom: e.target.value })}
              className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300">End Date:</label>
            <input
              type="date"
              name="dateTo"
              value={odData.dateTo}
              onChange={(e) => setODData({ ...odData, dateTo: e.target.value })}
              className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              required
            />
          </div>
          {dateError && <p className="text-red-500">{dateError}</p>}
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300">Reason for OD:</label>
            <textarea
              name="reason"
              value={odData.reason}
              onChange={(e) => setODData({ ...odData, reason: e.target.value })}
              className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              placeholder="Provide detailed reason for OD request"
              required
              minLength="10"
              maxLength="500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              Submit OD Request
            </button>
            <button
              type="button"
              onClick={() => setShowODForm(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showDetailsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl border-2 border-gray-900 dark:border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDetailsModal(false)}
              className="float-right text-gray-900 dark:text-white"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{event.name}</h2>
            {event.imageUrl && (
              <img src={event.imageUrl} alt={event.name} className="w-full h-64 object-cover rounded-lg my-4" />
            )}
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">Prize: {event.prize}</p>
              <p className="text-gray-700 dark:text-gray-300">Entry Fee: ₹{event.entryFee}</p>
              <p className="text-gray-700 dark:text-gray-300">Type: {event.entryType}</p>
              <p className="text-gray-700 dark:text-gray-300">Details: {event.details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;