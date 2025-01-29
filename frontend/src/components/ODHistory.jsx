import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
  const ODHistory = () => {
    const [historyRequests, setHistoryRequests] = useState([]);

    useEffect(() => {
      const fetchODHistory = async () => {
        try {
          const response = await api.get('/od/history');
          const currentDate = new Date();
          const currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false });
        
          const filteredRequests = response.data.filter(od => {
            const odDate = new Date(od.dateFrom);
            return (
              od.status === 'approved' || 
              od.status === 'rejected' ||
              (odDate < currentDate && od.startTime <= currentTime)
            );
          });
        
          setHistoryRequests(filteredRequests);
        } catch (error) {
          console.error('Error fetching OD history:', error);
        }
      };
      fetchODHistory();
    }, []);

    const getStatusIcon = (approvalStatus, overallStatus) => {
    if (overallStatus === 'rejected') return <FaTimesCircle className="text-red-500" />;
    if (overallStatus === 'approved' && approvalStatus) return <FaCheckCircle className="text-green-500" />;
    if (approvalStatus === true) return <FaCheckCircle className="text-green-500" />;
    return <FaClock className="text-yellow-500" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">OD History</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-orange-100 dark:bg-gray-700">
              <th className="p-2 text-left">Event Name</th>
              <th className="p-2 text-left">From Date</th>
              <th className="p-2 text-left">To Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Tutor Approval</th>
              <th className="p-2 text-left">AC Approval</th>
              <th className="p-2 text-left">HOD Approval</th>
            </tr>
          </thead>
          <tbody>
            {historyRequests.map((od) => (
              <tr key={od._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">{od.eventName}</td>
                <td className="p-2">{new Date(od.dateFrom).toLocaleDateString()}</td>
                <td className="p-2">{new Date(od.dateTo).toLocaleDateString()}</td>
                <td className="p-2">{od.status}</td>
                <td className="p-2">{getStatusIcon(od.tutorApproval, od.status)}</td>
                <td className="p-2">{getStatusIcon(od.acApproval, od.status)}</td>
                <td className="p-2">{getStatusIcon(od.hodApproval, od.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ODHistory;