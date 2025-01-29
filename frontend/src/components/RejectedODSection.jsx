import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaUndo, FaExternalLinkAlt } from 'react-icons/fa';

const RejectedODSection = () => {
  const [rejectedODs, setRejectedODs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedODs, setSelectedODs] = useState(new Set());

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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = rejectedODs.map(od => od._id);
      setSelectedODs(new Set(allIds));
    } else {
      setSelectedODs(new Set());
    }
  };

  const handleSelectSingle = (odId) => {
    const newSelected = new Set(selectedODs);
    if (newSelected.has(odId)) {
      newSelected.delete(odId);
    } else {
      newSelected.add(odId);
    }
    setSelectedODs(newSelected);
  };

  const handleBulkReconsider = async () => {
    try {
      await Promise.all(
        Array.from(selectedODs).map(odId =>
          api.post(`/od/${odId}/reconsider`)
        )
      );
      setRejectedODs(prevODs => 
        prevODs.filter(od => !selectedODs.has(od._id))
      );
      setSelectedODs(new Set());
    } catch (error) {
      console.error('Failed to reconsider ODs:', error);
      setError('Failed to reconsider OD requests');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading Rejected ODs...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rejected OD Requests</h2>
      
      {selectedODs.size > 0 && (
        <div className="mb-4">
          <button
            onClick={handleBulkReconsider}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Reconsider Selected ({selectedODs.size})
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-orange-100 dark:bg-gray-700">
              <th className="p-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedODs.size === rejectedODs.length && rejectedODs.length > 0}
                />
              </th>
              <th className="p-2 text-left">Student Name</th>
              <th className="p-2 text-left">Roll No</th>
              <th className="p-2 text-left">Event Name</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Verification</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rejectedODs.map((request) => (
              <tr key={request._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedODs.has(request._id)}
                    onChange={() => handleSelectSingle(request._id)}
                  />
                </td>
                <td className="p-2">{request.studentId.name}</td>
                <td className="p-2">{request.studentId.rollNo}</td>
                <td className="p-2">{request.eventName}</td>
                <td className="p-2">
                  <div>From: {new Date(request.dateFrom).toLocaleDateString()} {request.startTime}</div>
                  <div>To: {new Date(request.dateTo).toLocaleDateString()} {request.endTime}</div>
                </td>
                <td className="p-2">
                  {request.isExternal && request.proof && (
                    <a
                      href={request.proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 inline-flex items-center"
                    >
                      Verify <FaExternalLinkAlt className="ml-1" />
                    </a>
                  )}
                </td>
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