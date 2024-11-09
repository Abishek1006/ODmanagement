import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/ODSection.css';

const ODApprovalSection = () => {
  const [odRequests, setODRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchODRequests = async () => {
      try {
        const response = await api.get('/teacher/od-requests');
        setODRequests(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load OD requests');
        setLoading(false);
      }
    };

    fetchODRequests();
  }, []);

  const handleApproval = async (requestId, status) => {
    try {
      await api.put(`/od-requests/${requestId}`, { status });
      // Update local state to reflect the change
      setODRequests(odRequests.map(request => 
        request._id === requestId 
          ? {...request, status: status} 
          : request
      ));
    } catch (error) {
      setError('Failed to update OD request');
    }
  };

  if (loading) return <div>Loading OD Requests...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="od-approval-section">
      <h2>OD Approval Requests</h2>
      <table className="od-requests-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Event Name</th>
            <th>Date From</th>
            <th>Date To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {odRequests.map(request => (
            <tr key={request._id}>
              <td>{request.studentName}</td>
              <td>{request.eventName}</td>
              <td>{new Date(request.dateFrom).toLocaleDateString()}</td>
              <td>{new Date(request.dateTo).toLocaleDateString()}</td>
              <td>{request.status}</td>
              <td>
                <button 
                  onClick={() => handleApproval(request._id, 'approved')}
                  disabled={request.status !== 'pending'}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleApproval(request._id, 'rejected')}
                  disabled={request.status !== 'pending'}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ODApprovalSection;
