import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ODSection = () => {
  const { user } = useAuth();
  const [odRequests, setODRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchODRequests();
  }, []);

  const fetchODRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/od-requests', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setODRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch OD requests');
      setLoading(false);
    }
  };

  const requestImmediateOD = async () => {
    try {
      const response = await axios.post('/api/od-requests/immediate', {}, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setODRequests([...odRequests, response.data]);
    } catch (err) {
      setError('Failed to request immediate OD');
    }
  };

  const approveRejectOD = async (odId, status) => {
    try {
      await axios.put(`/api/od-requests/${odId}`, { status }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      fetchODRequests(); // Refresh the list after approval/rejection
    } catch (err) {
      setError(`Failed to ${status} OD request`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="od-section">
      {user.role === 'student' && (
        <button onClick={requestImmediateOD}>Request Immediate OD</button>
      )}
      <h2>OD Requests</h2>
      {odRequests.map(od => (
        <div key={od._id} className="od-request">
          <p>{od.studentName} - {od.eventName}</p>
          <p>Status: {od.status}</p>
          {user.role !== 'student' && (
            <div>
              <button onClick={() => approveRejectOD(od._id, 'approved')}>Approve</button>
              <button onClick={() => approveRejectOD(od._id, 'rejected')}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ODSection;