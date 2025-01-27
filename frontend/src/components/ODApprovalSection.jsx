import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const ODApprovalSection = () => {
  const [odRequests, setODRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedODs, setSelectedODs] = useState(new Set());
  const [processingBulk, setProcessingBulk] = useState(false);

  useEffect(() => {
    const fetchODRequests = async () => {
      try {
        const response = await api.get('/od/teacher-requests');
        setODRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch OD requests:', error);
        setError('Failed to load OD requests');
        setLoading(false);
      }
    };
    fetchODRequests();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allPendingIds = filteredRequests.map((request) => request._id);
      setSelectedODs(new Set(allPendingIds));
    } else {
      setSelectedODs(new Set());
    }
  };

  const handleSingleSelect = (odId) => {
    const newSelected = new Set(selectedODs);
    if (newSelected.has(odId)) {
      newSelected.delete(odId);
    } else {
      newSelected.add(odId);
    }
    setSelectedODs(newSelected);
  };

  const handleBulkAction = async (status) => {
    setProcessingBulk(true);
    try {
      setODRequests((prevRequests) =>
        prevRequests.map((request) =>
          selectedODs.has(request._id) ? { ...request, status: status } : request
        )
      );

      await Promise.all(
        Array.from(selectedODs).map((odId) =>
          api.patch(`/od/${odId}/teacher-approval`, { status })
        )
      );

      setTimeout(() => {
        setODRequests((prevRequests) =>
          prevRequests.filter((request) => !selectedODs.has(request._id))
        );
        setSelectedODs(new Set());
      }, 500);
    } catch (error) {
      console.error('Failed to process bulk OD requests:', error);
      setError('Failed to process some OD requests');
      setODRequests((prevRequests) =>
        prevRequests.map((request) =>
          selectedODs.has(request._id) ? { ...request, status: 'pending' } : request
        )
      );
    }
    setProcessingBulk(false);
  };

  const handleODApproval = async (odId, status) => {
    try {
      setODRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === odId ? { ...request, status: status } : request
        )
      );

      await api.patch(`/od/${odId}/teacher-approval`, { status });

      setTimeout(() => {
        setODRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== odId)
        );
      }, 500);
    } catch (error) {
      console.error('Failed to update OD request:', error);
      setError('Failed to process OD request');
      setODRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === odId ? { ...request, status: 'pending' } : request
        )
      );
    }
  };

  const filteredRequests = odRequests.filter((request) => {
    const userDetails = api.getUserDetails();
    const teacherId = userDetails._id;
    return (
      (request.tutorId === teacherId && !request.tutorApproval) ||
      (request.acId === teacherId && !request.acApproval && request.tutorApproval) ||
      (request.hodId === teacherId && !request.hodApproval && request.acApproval)
    );
  });

  if (loading) return <div className="flex justify-center items-center h-64">Loading OD Requests...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">OD Approval Requests</h2>

      {selectedODs.size > 0 && (
        <div className="bulk-actions flex space-x-2 mb-4">
          <button
            onClick={() => handleBulkAction('approved')}
            disabled={processingBulk}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
          >
            <FaCheck className="mr-2" /> Approve Selected ({selectedODs.size})
          </button>
          <button
            onClick={() => handleBulkAction('rejected')}
            disabled={processingBulk}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
          >
            <FaTimes className="mr-2" /> Reject Selected ({selectedODs.size})
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
                  checked={selectedODs.size === filteredRequests.length && filteredRequests.length > 0}
                />
              </th>
              <th className="p-2 text-left">Student Name</th>
              <th className="p-2 text-left">Roll No</th>
              <th className="p-2 text-left">Event Name</th>
              <th className="p-2 text-left">Date From</th>
              <th className="p-2 text-left">Date To</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedODs.has(request._id)}
                    onChange={() => handleSingleSelect(request._id)}
                  />
                </td>
                <td className="p-2">{request.studentId.name}</td>
                <td className="p-2">{request.studentId.rollNo}</td>
                <td className="p-2">{request.eventName}</td>
                <td className="p-2">{new Date(request.dateFrom).toLocaleDateString()}</td>
                <td className="p-2">{new Date(request.dateTo).toLocaleDateString()}</td>
                <td className="p-2">{request.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleODApproval(request._id, 'approved')}
                    disabled={request.status !== 'pending'}
                    className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
                  >
                    <FaCheckCircle className="mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handleODApproval(request._id, 'rejected')}
                    disabled={request.status !== 'pending'}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
                  >
                    <FaTimesCircle className="mr-1" /> Reject
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

export default ODApprovalSection;