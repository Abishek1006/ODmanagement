import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ODSection = () => {
  const { currentUser } = useAuth();
  const [odRequests, setOdRequests] = useState([]);

  useEffect(() => {
    fetchODRequests();
  }, []);

  const fetchODRequests = async () => {
    try {
      const response = await axios.get(`/api/od-requests?userId=${currentUser.id}`);
      setOdRequests(response.data);
    } catch (error) {
      console.error('Error fetching OD requests:', error);
    }
  };

  return (
    <div>
      <h2>OD Section</h2>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {odRequests.map(request => (
            <tr key={request.id}>
              <td>{request.eventName}</td>
              <td>{new Date(request.date).toLocaleDateString()}</td>
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ODSection;
