import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../css/CourseDetailsView.css';

const CourseDetailsView = () => {
  const [studentsWithOD, setStudentsWithOD] = useState(null);
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
              <th>Event Name</th>
              <th>Purpose</th>
              <th>From Date</th>
              <th>To Date</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithOD.studentsWithOD.map(student => (
              student.activeODs.map((od, odIndex) => (
                <tr key={`${student._id}-${odIndex}`}>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.department}</td>
                  <td>{od.eventName}</td>
                  <td>{od.reason}</td>
                  <td>{new Date(od.dateFrom).toLocaleDateString()}</td>
                  <td>{new Date(od.dateTo).toLocaleDateString()}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseDetailsView;