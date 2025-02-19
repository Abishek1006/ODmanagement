import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
  const ODSection = () => {
    const [odRequests, setOdRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchODRequests = async () => {
        try {
          setLoading(true);
          const response = await api.get('/od');
          console.log('OD Requests Response:', response.data);
          setOdRequests(response.data);
        } catch (error) {
          console.error('Error fetching OD requests:', error);
          setError('Failed to load OD requests');
        } finally {
          setLoading(false);
        }
      };
      fetchODRequests();
    }, []);

    const getStatusIcon = (approvalStatus, overallStatus) => {
      if (overallStatus === 'rejected') return <FaTimesCircle className="text-red-500" />;
      if (overallStatus === 'approved' && approvalStatus) return <FaCheckCircle className="text-green-500" />;
      if (approvalStatus === true) return <FaCheckCircle className="text-green-500" />;
      return <FaClock className="text-yellow-500" />;
    };

    if (loading) return <div>Loading OD requests...</div>;
    if (error) return <div>{error}</div>;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">My OD Requests</h2>
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-left text-xs md:text-sm font-semibold">Event</th>
                    <th className="hidden md:table-cell p-2 text-left text-xs md:text-sm font-semibold">From</th>
                    <th className="hidden md:table-cell p-2 text-left text-xs md:text-sm font-semibold">To</th>
                    <th className="hidden md:table-cell p-2 text-left text-xs md:text-sm font-semibold">Start</th>
                    <th className="hidden md:table-cell p-2 text-left text-xs md:text-sm font-semibold">End</th>
                    <th className="p-2 text-left text-xs md:text-sm font-semibold">Status</th>
                    <th className="p-2 text-left text-xs md:text-sm font-semibold">Approvals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {odRequests.map((od) => (
                    <tr key={od._id} className="hover:bg-gray-50">
                      <td className="p-2 text-xs md:text-sm">
                        {od.eventName}
                        <div className="md:hidden text-gray-500 text-xs">
                          {new Date(od.dateFrom).toLocaleDateString()} - {new Date(od.dateTo).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="hidden md:table-cell p-2 text-xs md:text-sm">{new Date(od.dateFrom).toLocaleDateString()}</td>
                      <td className="hidden md:table-cell p-2 text-xs md:text-sm">{new Date(od.dateTo).toLocaleDateString()}</td>
                      <td className="hidden md:table-cell p-2 text-xs md:text-sm">{od.startTime}</td>
                      <td className="hidden md:table-cell p-2 text-xs md:text-sm">{od.endTime}</td>
                      <td className="p-2 text-xs md:text-sm">{od.status}</td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          {getStatusIcon(od.tutorApproval, od.status)}
                          {getStatusIcon(od.acApproval, od.status)}
                          {getStatusIcon(od.hodApproval, od.status)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default ODSection;