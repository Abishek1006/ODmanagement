import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const CourseDetailsView = () => {
  const [studentsWithOD, setStudentsWithOD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchStudentsWithOD = async () => {
      try {
        console.log('Fetching students for courseId:', courseId); // Add diagnostic logging
        const response = await api.getStudentsWithOD(courseId);
        console.log('Response:', response.data); // Log the response
        setStudentsWithOD(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Full Error Details:', {
          error: error.response?.data,
          status: error.response?.status,
          message: error.message
        });
        setError(error.response?.data?.message || 'Failed to load students');
        setLoading(false);
      }
    };

    fetchStudentsWithOD();
  }, [courseId]);

  if (loading) return <div className="loading">Loading students data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!studentsWithOD) return <div>No students with OD found</div>;

  return (
    <div className="students-od-view">
      <h2>{studentsWithOD.courseName} - Students on OD Today</h2>
      <div className="stats">
        <p>Total Students: {studentsWithOD.totalStudents}</p>
      </div>
      
      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Event Details</th>
              <th>OD Duration</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithOD.studentsWithOD.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.rollNo}</td>
                <td>{student.department}</td>
                <td>
                  {student.activeODs.map(od => (
                    <div key={od._id} className="od-details">
                      <p>{od.eventName}</p>
                    </div>
                  ))}
                </td>
                <td>
                  {student.activeODs.map(od => (
                    <div key={od._id}>
                      {new Date(od.dateFrom).toLocaleDateString()} - 
                      {new Date(od.dateTo).toLocaleDateString()}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseDetailsView;