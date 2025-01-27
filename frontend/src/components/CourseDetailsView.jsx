import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaCalendarAlt, FaUser, FaBook, FaInfoCircle } from 'react-icons/fa';

const CourseDetailsView = () => {
  const [studentsWithOD, setStudentsWithOD] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchStudentsWithOD = async () => {
      try {
        const response = await api.getStudentsWithOD(courseId);
        setStudentsWithOD(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load students');
        setLoading(false);
      }
    };

    fetchStudentsWithOD();
  }, [courseId]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading students data...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!studentsWithOD) return <div className="text-center">No students with OD found</div>;

  const renderStudentTable = (ods, title) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-orange-100 dark:bg-gray-700">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Roll Number</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Event Name</th>
              <th className="p-2 text-left">Purpose</th>
              <th className="p-2 text-left">From Date</th>
              <th className="p-2 text-left">To Date</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithOD.studentsWithOD.map((student) =>
              (activeTab === 'today' ? student.todayODs : student.yesterdayODs).map((od, odIndex) => (
                <tr key={`${student._id}-${odIndex}`} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.rollNo}</td>
                  <td className="p-2">{student.department}</td>
                  <td className="p-2">{od.eventName}</td>
                  <td className="p-2">{od.reason}</td>
                  <td className="p-2">{new Date(od.dateFrom).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(od.dateTo).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaBook className="mr-2" /> {studentsWithOD.courseName} - Students on OD
      </h2>
      <div className="stats bg-orange-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
        <p className="text-gray-700 dark:text-gray-300">Total Students: {studentsWithOD.totalStudents}</p>
      </div>

      <div className="tab-buttons flex space-x-2 mb-4">
        <button
          className={`tab-btn ${activeTab === 'today' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500'} px-4 py-2 rounded-lg`}
          onClick={() => setActiveTab('today')}
        >
          Today's ODs
        </button>
        <button
          className={`tab-btn ${activeTab === 'yesterday' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500'} px-4 py-2 rounded-lg`}
          onClick={() => setActiveTab('yesterday')}
        >
          Yesterday's ODs
        </button>
      </div>

      {activeTab === 'today'
        ? renderStudentTable('todayODs', "Today's OD List")
        : renderStudentTable('yesterdayODs', "Yesterday's OD List")}
    </div>
  );
};

export default CourseDetailsView;