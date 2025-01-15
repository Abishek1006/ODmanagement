import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/ODSection.css';

const ODHistory = () => {
  const [historyRequests, setHistoryRequests] = useState([]);

  useEffect(() => {
    const fetchODHistory = async () => {
      try {
        const response = await api.get('/od/history');
        setHistoryRequests(response.data);
      } catch (error) {
        console.error('Error fetching OD history:', error);
      }
    };
    fetchODHistory();
  }, []);

  const getStatusIcon = (approvalStatus, overallStatus) => {
    if (overallStatus === 'rejected') return '❌';
    if (overallStatus === 'approved' && approvalStatus) return '✅';
    if (approvalStatus === true) return '✅';
    return '⌛';
  };

  return (
    <div className="od-section">
      <h2>OD History</h2>
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
            {historyRequests.map(od => (
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
  );
};

export default ODHistory;
