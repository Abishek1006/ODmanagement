import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { requestOD } from '../services/eventservice';
import EventDetails from './EventDetails';
import {
  FaTrash,
  FaCalendarAlt,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaRegCalendarCheck,
  FaImage,
} from 'react-icons/fa';
const EventCard = ({ event, showDelete = false }) => {
  const [showEventDetails, setShowEventDetails] = useState(false);
  const navigate = useNavigate();
  const [showODForm, setShowODForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [odData, setODData] = useState({
    dateFrom: event.startDate,
    dateTo: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    reason: "",
    eventName: event.name,
    semester: "" // Add this
  });


  const [dateError, setDateError] = useState("");
  const user = api.getUserRoles();

  const validateDates = () => {
    const fromDate = new Date(odData.dateFrom);
    const toDate = new Date(odData.dateTo);
    const today = new Date();

    if (fromDate < today) {
      setDateError("Start date cannot be in the past");
      return false;
    }
    if (toDate < fromDate) {
      setDateError("End date must be after start date");
      return false;
    }
    if ((toDate - fromDate) / (1000 * 60 * 60 * 24) > 7) {
      setDateError("OD duration cannot exceed 7 days");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleRequestOD = async (e) => {
    e.preventDefault();
    
    if (!odData.semester) {
      alert("Please select a semester");
      return;
    }

    try {
      const requestPayload = {
        eventName: event.name,
        dateFrom: event.startDate,
        dateTo: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        reason: odData.reason,
        isExternal: false,
        location: event.location || "",
        eventType: event.entryType || "",
        semester: odData.semester,  // Ensure semester is included
      };
      console.log('Request Payload:', requestPayload);
      await requestOD(requestPayload);
      setShowODForm(false);
      alert("OD request submitted successfully");
    } catch (error) {
      alert(`Failed to submit OD request: ${error.message}`);
    }
  };
  

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${event._id}`);
        alert("Event deleted successfully");
        window.location.reload();
      } catch (error) {
        alert("Error deleting event");
      }
    }
  };

  const handleRegister = () => {
    window.open(event.formLink, "_blank");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 border-2 border-gray-900 dark:border-gray-600 w-[320px] min-h-[600px] flex flex-col">
      {/* Image container */}
      <div className="relative w-full pb-[56.25%] mb-4">
        {event.image && !imageError ? (
          <img
            src={event.image}
            alt={event.name}
            className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100 rounded-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
            <FaImage className="text-gray-400 text-4xl animate-bounce" />
          </div>
        )}
      </div>

      {/* Event Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
        {event.name}
      </h3>

      {/* Event Details */}
      <div className="space-y-2 mb-4">
    <p className="text-gray-700 dark:text-gray-300 flex items-center justify-between">
      <span>Participation:</span>
      <span className="font-medium">{event.entryType}</span>
    </p>
    <p className="text-gray-700 dark:text-gray-300 flex items-center justify-between">
      <span>Start:</span>
      <span className="font-medium">
        {new Date(event.startDate).toLocaleDateString()} {event.startTime}
      </span>
    </p>
    <p className="text-gray-700 dark:text-gray-300 flex items-center justify-between">
      <span>End:</span>
      <span className="font-medium">
        {new Date(event.endDate).toLocaleDateString()} {event.endTime}
      </span>
    </p>
  </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleRegister}
          className="flex items-center justify-center bg-orange-500 text-white px-2 py-1 rounded-lg hover:bg-orange-600 transition-colors duration-300 text-sm"
        >
          <FaExternalLinkAlt className="mr-1" /> Register
        </button>
        <button
          onClick={() => setShowODForm(!showODForm)}
          className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm"
        >
          <FaCalendarAlt className="mr-1" /> Request OD
        </button>
        <button
          onClick={() => setShowEventDetails(true)}
          className="flex items-center justify-center bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-colors duration-300 text-sm col-span-2"
        >
          <FaInfoCircle className="mr-1" /> View Details
        </button>
      </div>

      {/* OD Form */}
      {showODForm && (
        <form onSubmit={handleRequestOD} className="mt-4 space-y-4">
          <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Event Details
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Event Name: {event.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              From: {new Date(event.startDate).toLocaleDateString()} {event.startTime}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              To: {new Date(event.endDate).toLocaleDateString()} {event.endTime}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300">
              Reason for OD:
            </label>
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
          <div className="space-y-2">
    <label className="block text-gray-700 dark:text-gray-300">
      Semester:
    </label>
    <select
      name="semester"
      value={odData.semester}
      onChange={(e) => setODData({ ...odData, semester: e.target.value })}
      className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
      required
    >
      <option value="">Select Semester</option>
      {['1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
        <option key={sem} value={sem}>Semester {sem}</option>
      ))}
    </select>
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

      {/* Event Details Popup */}
      {showEventDetails && <EventDetails event={event} onClose={() => setShowEventDetails(false)} />}
    </div>
  );
};

export default EventCard;