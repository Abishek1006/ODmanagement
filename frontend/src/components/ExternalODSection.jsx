import React, { useState } from 'react';
import api from '../services/api';
import { requestOD } from '../services/eventservice';
import { FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaLink, FaPaperPlane } from 'react-icons/fa';

const ExternalODSection = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    dateFrom: '',
    dateTo: '',
    startTime: '',
    endTime: '',
    reason: '',
    location: '',
    eventType: '',
    proof: '',
  });

  // Add semester field in the form


  const [submitted, setSubmitted] = useState(false);
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const confirmed = window.confirm(
        `Please confirm your External OD request details:\n
        Event: ${formData.eventName}\n
        Date: ${formData.dateFrom} to ${formData.dateTo}\n
        Time: ${formData.startTime} to ${formData.endTime}\n
        Location: ${formData.location}\n
        Type: ${formData.eventType}\n
        \nAre you sure you want to submit this request?`
      );

      if (confirmed) {
        try {
          await requestOD({
            ...formData,
            isExternal: true,
          });
          setSubmitted(true);
          setFormData({
            eventName: '',
            dateFrom: '',
            dateTo: '',
            startTime: '',
            endTime: '',
            reason: '',
            location: '',
            eventType: '',
            proof: '',
          });
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaCalendarAlt className="mr-2" /> External OD Request Form
      </h2>
      {submitted && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
          External OD request submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaInfoCircle className="mr-2" /> Event/Activity Name
          </label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            placeholder="Enter event or activity name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaInfoCircle className="mr-2" /> Event Type
          </label>
          <input
            type="text"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            placeholder="e.g., Competition, Workshop, Internship, etc."
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            placeholder="Enter event location"
            required
          />
        </div>
        <div>
    <label className="block text-gray-700 dark:text-gray-300 flex items-center">
      <FaInfoCircle className="mr-2" /> Semester
    </label>
    <select
      name="semester"
      value={formData.semester}
      onChange={handleChange}
      className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
      required
    >
      <option value="">Select Semester</option>
      {['1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
        <option key={sem} value={sem}>Semester {sem}</option>
      ))}
    </select>
  </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaCalendarAlt className="mr-2" /> From Date
          </label>
          <input
            type="date"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaCalendarAlt className="mr-2" /> To Date
          </label>
          <input
            type="date"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            required
          />
        </div>
        <div>
  <label className="block text-gray-700 dark:text-gray-300 flex items-center">
    <FaCalendarAlt className="mr-2" /> Start Time
  </label>
  <input
    type="time"
    name="startTime"
    value={formData.startTime}
    onChange={handleChange}
    className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
    required
  />
</div>
<div>
  <label className="block text-gray-700 dark:text-gray-300 flex items-center">
    <FaCalendarAlt className="mr-2" /> End Time
  </label>
  <input
    type="time"
    name="endTime"
    value={formData.endTime}
    onChange={handleChange}
    className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
    required
  />
</div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaInfoCircle className="mr-2" /> Reason/Description
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            placeholder="Provide detailed reason for the OD request"
            required
            rows="4"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaLink className="mr-2" /> Event Verification Link
          </label>
          <input
            type="url"
            name="proof"
            value={formData.proof}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            placeholder="Enter event link (LinkedIn post, Instagram post, Event website etc.)"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center"
        >
          <FaPaperPlane className="mr-2" /> Submit External OD Request
        </button>
      </form>
    </div>
  );
};

export default ExternalODSection;