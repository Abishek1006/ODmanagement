import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/ODSection.css';

const ODSection = () => {
  const [odRequests, setOdRequests] = useState([]);

  useEffect(() => {
    const fetchODRequests = async () => {
      try {
        const response = await api.get('/od');
        setOdRequests(response.data);
      } catch (error) {
        console.error('Error fetching OD requests:', error);
      }
    };
    fetchODRequests();
  }, []);

  const getStatusIcon = (approvalStatus, overallStatus) => {
    // If the overall status is rejected, show rejection icon
    if (overallStatus === 'rejected') {
      return '❌';
    }
  
    // If the overall status is approved and approvalStatus is true, show approved icon
    if (overallStatus === 'approved' && approvalStatus) {
      return '✅';
    }
  
    // For pending status
    if (approvalStatus === true) {
      return '✅';
    }
  
    return '⌛';
  };

  return (
    <div className="od-section">
      <h2>My OD Requests</h2>
      <div className="od-table">
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Status</th>
              <th>Tutor Approval</th>
              <th>AC Approval</th>
              <th>HOD Approval</th>
            </tr>
          </thead>
          <tbody>
            {odRequests.map(od => (
              <tr key={od._id}>
                <td>{od.eventName}</td>
                <td>{new Date(od.dateFrom).toLocaleDateString()}</td>
                <td>{new Date(od.dateTo).toLocaleDateString()}</td>
                <td className={`status-${od.status}`}>{od.status}</td>
                <td>{getStatusIcon(od.tutorApproval, od.status)}</td>
                <td>{getStatusIcon(od.acApproval, od.status)}</td>
                <td>{getStatusIcon(od.hodApproval, od.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );};

export default ODSection;