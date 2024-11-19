import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const CourseDetailsView = () => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        console.log('Fetching details for course:', courseId);
        const response = await api.get(`/od/students-with-od?courseId=${courseId}`);
        console.log('Received data:', response.data);
        setCourseDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError(`Failed to load course details: ${error.response?.data?.message || error.message}`);
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  if (loading) return <div>Loading course details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!courseDetails) return <div>No course details available</div>;

  return (
    <div className="course-details-view">
      <h2>Course: {courseDetails?.courseName}</h2>
      <div className="students-list">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              {/* <th>OD Details</th>
              <th>OD Status</th> */}
            </tr>
          </thead>
          <tbody>
            {courseDetails?.students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.rollNo}</td>
                <td>{student.department}</td>
                <td>{student.odRequests?.length > 0 ? 
                    student.odRequests.map(od => (
                      <div key={od._id}>
                        <p>Event: {od.eventName}</p>
                        <p>Date: {new Date(od.dateFrom).toLocaleDateString()} - {new Date(od.dateTo).toLocaleDateString()}</p>
                      </div>
                    )) : 'No OD Requests'}
                </td>
                <td>{student.odRequests?.some(od => od.status === 'approved') ? 'Approved' : 'No Active OD'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseDetailsView;