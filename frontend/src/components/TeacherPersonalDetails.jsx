import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/teacher.css';

const TeacherPersonalDetails = () => {
  const [teacherDetails, setTeacherDetails] = useState({
    name: '',
    email: '',
    department: '',
    staffId: '',
    courses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        console.log('Fetching teacher details...');
        const userDetailsResponse = await api.get('/user-details');
        console.log('Teacher details response:', userDetailsResponse.data);
        
        if (userDetailsResponse.data) {
          setTeacherDetails({
            name: userDetailsResponse.data.name || '',
            email: userDetailsResponse.data.email || '',
            department: userDetailsResponse.data.department || '',
            staffId: userDetailsResponse.data.staffId || '',
            courses: userDetailsResponse.data.courses || []
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        setError('Failed to load teacher details');
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, []);

  if (loading) return <div>Loading teacher details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="teacher-personal-details">
      <h2>Teacher Profile</h2>
      <div className="details-section">
        <div className="detail-row">
          <label>Name:</label>
          <span>{teacherDetails.name}</span>
        </div>

        <div className="detail-row">
          <label>Email:</label>
          <span>{teacherDetails.email}</span>
        </div>

        <div className="detail-row">
          <label>Staff ID:</label>
          <span>{teacherDetails.staffId}</span>
        </div>

        <div className="detail-row">
          <label>Department:</label>
          <span>{teacherDetails.department}</span>
        </div>
          <div className="courses-section">
            <h3>Teaching Courses</h3>
            {teacherDetails.courses && teacherDetails.courses.length > 0 ? (
              <ul>
                {teacherDetails.courses.map((course, index) => (
                  <li key={index}>
                    {course.courseId ? course.courseId.courseName : 'Course Name Not Available'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No courses assigned</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default TeacherPersonalDetails;