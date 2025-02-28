import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaExternalLinkAlt } from 'react-icons/fa';

const ODApprovalSection = () => {
  const [odRequests, setODRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedODs, setSelectedODs] = useState(new Set());

  const filterFutureODs = (requests) => {
    const currentDateTime = new Date();
    return requests.filter(request => {
      const odStartDate = new Date(request.dateFrom);
      if (odStartDate.getDate() === currentDateTime.getDate()) {
        // For same day, compare time
        const odTime = request.startTime.split(':');
        const currentTime = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
        const odTimeInMinutes = parseInt(odTime[0]) * 60 + parseInt(odTime[1]);
        return odTimeInMinutes >= currentTime;
      }
      return odStartDate > currentDateTime;
    });
  };

  useEffect(() => {
    const fetchODRequests = async () => {
      try {
        const response = await api.get('/od/teacher-requests');
        const futureODs = filterFutureODs(response.data);
        setODRequests(futureODs);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch OD requests:', error);
        setError('Failed to load OD requests');
        setLoading(false);
      }
    };
    fetchODRequests();
  }, []);

  const handleODApproval = async (odId, status) => {
    try {
      const response = await api.patch(`/od/${odId}/teacher-approval`, { status });
      if (response.data) {
        setODRequests(prevRequests => 
          prevRequests.filter(request => request._id !== odId)
        );
      }
    } catch (error) {
      if (error.response?.status === 403) {
        // Handle hierarchical validation errors
        setError(error.response.data.message);
      } else {
        setError('Failed to process OD request');
      }
    }
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = odRequests.map(request => request._id);
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

  const handleBulkApproval = async (status) => {
    try {
      await Promise.all(
        Array.from(selectedODs).map(odId =>
          api.patch(`/od/${odId}/teacher-approval`, { status })
        )
      );

      // Update local state
      setODRequests(prevRequests =>
        prevRequests.filter(request => !selectedODs.has(request._id))
      );
      setSelectedODs(new Set());
    } catch (error) {
      console.error('Failed to process bulk OD requests:', error);
      setError('Failed to process some OD requests');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading OD Requests...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      {selectedODs.size > 0 && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => handleBulkApproval('approved')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Approve Selected ({selectedODs.size})
          </button>
          <button
            onClick={() => handleBulkApproval('rejected')}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Reject Selected ({selectedODs.size})
          </button>
        </div>
      )}
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedODs.size === odRequests.length && odRequests.length > 0}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {odRequests.map((request) => (
            <tr key={request._id}>
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedODs.has(request._id)}
                  onChanzzge={() => handleSelectSingle(request._id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {request.studentId?.name || 'Not mentioned'}
                </div>
                <div className="text-sm text-gray-500">
                  {request.studentId?.rollNo || 'Not mentioned'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {request.eventName || 'Not mentioned'}
                </div>
                {request.isExternal && request.proof && (
                  <div className="text-sm text-gray-500">
                    <a
                      href={request.proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 inline-flex items-center"
                    >
                      Verification Link <FaExternalLinkAlt className="ml-1" />
                    </a>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  From: {new Date(request.dateFrom).toLocaleDateString()} {request.startTime || 'Not mentioned'}
                </div>
                <div className="text-sm text-gray-500">
                  To: {new Date(request.dateTo).toLocaleDateString()} {request.endTime || 'Not mentioned'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {request.reason || 'Not mentioned'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleODApproval(request._id, 'approved')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaCheckCircle className="mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handleODApproval(request._id, 'rejected')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTimesCircle className="mr-1" /> Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ODApprovalSection;