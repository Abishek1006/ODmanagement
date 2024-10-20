import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ODSection = () => {
  const [odRequests, setOdRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchODRequests = async () => {
      try {
        const response = await api.get('/od');
        setOdRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching OD requests:', error);
        setError('Failed to load OD requests. Please try again later.');
        setLoading(false);
      }
    };
    fetchODRequests();
  }, []);

  if (loading) return <p>Loading OD requests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">OD Requests</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date From</th>
            <th>Date To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {odRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.eventName}</td>
              <td>{new Date(request.dateFrom).toLocaleDateString()}</td>
              <td>{new Date(request.dateTo).toLocaleDateString()}</td>
              <td>{request.reason}</td>
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ODSection;
