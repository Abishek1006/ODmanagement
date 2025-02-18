import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaCalendarAlt, FaMoneyBillAlt, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
  const EventDetails = ({ event, onClose }) => {
    if (!event) return <p>Loading event details...</p>;

    const handleRegister = () => {
      window.open(event.formLink, '_blank');
    };
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center pt-20 pb-8 px-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl p-6 transform transition-transform duration-300 ease-in-out translate-y-0 animate-slide-up max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        
          {event.image && (
            <div className="relative w-full">
              <img 
                src={event.image} 
                alt={event.name} 
                className="w-full max-h-[70vh] object-contain bg-gray-100 rounded-lg mb-4 mx-auto"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{event.name}</h1>
          <div className="space-y-2 mt-4">
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaCalendarAlt className="mr-2" /> Start Date: {new Date(event.startDate).toLocaleDateString()} {event.startTime || 'Not specified'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaCalendarAlt className="mr-2" /> End Date: {new Date(event.endDate).toLocaleDateString()} {event.endTime || 'Not specified'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaMoneyBillAlt className="mr-2" /> Prize: {event.prize || 'Not specified'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaMoneyBillAlt className="mr-2" /> Entry Fee: {event.entryFee ? `₹${event.entryFee}` : 'Not specified'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaInfoCircle className="mr-2" /> ParticiType: {event.entryType || 'Not specified'}
            </p>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">Details:</p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line pl-4">
                {event.details || 'No details available'}
              </p>
            </div>
          </div>
          <button
            onClick={handleRegister}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center"
          >
            <FaExternalLinkAlt className="mr-2" /> Register Now
          </button>
        </div>
      </div>
    );
  };export default EventDetails;