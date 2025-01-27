import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaUndo } from 'react-icons/fa';

const RejectedODSection = () => {
  const [rejectedODs, setRejectedODs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRejectedODs();
  }, []);

  const fetchRejectedODs = async () => {
    try {
      const response = await api.get('/od/rejected-requests');
      setRejectedODs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch rejected ODs:', error);
      setError('Failed to load rejected OD requests');
      setLoading(false);
    }
  };

  const handleReconsider = async (odId) => {
    try {
      await api.post(`/od/${odId}/reconsider`);
      setRejectedODs((prevODs) => prevODs.filter((od) => od._id !== odId));
    } catch (error) {
      console.error('Failed to reconsider OD:', error);
      setError('Failed to reconsider OD request');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading Rejected ODs...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rejected OD Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-orange-100 dark:bg-gray-700">
              <th className="p-2 text-left">Student Name</th>
              <th className="p-2 text-left">Roll No</th>
              <th className="p-2 text-left">Event Name</th>
              <th className="p-2 text-left">Date From</th>
              <th className="p-2 text-left">Date To</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rejectedODs.map((request) => (
              <tr key={request._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">{request.studentId.name}</td>
                <td className="p-2">{request.studentId.rollNo}</td>
                <td className="p-2">{request.eventName}</td>
                <td className="p-2">{new Date(request.dateFrom).toLocaleDateString()}</td>
                <td className="p-2">{new Date(request.dateTo).toLocaleDateString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleReconsider(request._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
                  >
                    <FaUndo className="mr-1" /> Reconsider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedODSection;