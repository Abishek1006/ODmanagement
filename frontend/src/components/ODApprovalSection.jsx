import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/ODApprovalSection.css';

const ODApprovalSection = () => {
  const [odRequests, setODRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const handleODApproval = async (odId, status) => {
    try {
      const response = await api.patch(`/od/${odId}/teacher-approval`, { status });
      
      // Update local state
      setODRequests(prevRequests => 
        prevRequests.map(request => 
          request._id === odId ? response.data : request
        )
      );
    } catch (error) {
      console.error('Failed to update OD request:', error);
      setError('Failed to process OD request');
    }
  };

  const filteredRequests = odRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) return <div>Loading OD Requests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="od-approval-section">
      <h2>OD Approval Requests</h2>
      
      <div className="filter-section">
        <label>Filter by Status: </label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table className="od-requests-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Roll No</th>
            <th>Event Name</th>
            <th>Date From</th>
            <th>Date To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(request => (
            <tr key={request._id}>
              <td>{request.studentId.name}</td>
              <td>{request.studentId.rollNo}</td>
              <td>{request.eventName}</td>
              <td>{new Date(request.dateFrom).toLocaleDateString()}</td>
              <td>{new Date(request.dateTo).toLocaleDateString()}</td>
              <td>{request.status}</td>
              <td>
                <button 
                  onClick={() => handleODApproval(request._id, 'approved')}
                  disabled={request.status !== 'pending'}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleODApproval(request._id, 'rejected')}
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