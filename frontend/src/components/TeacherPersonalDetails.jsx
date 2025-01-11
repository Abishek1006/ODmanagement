import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/TeacherPersonalDetails.css';

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
  const [teachingCourses, setTeachingCourses] = useState([]);
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
    fetchTeachingCourses();
  }, []);

  const fetchTeachingCourses = async () => {
    try {
      const response = await api.get('/courses/teacher-courses'); // Updated correct endpoint
      setTeachingCourses(response.data);
    } catch (error) {
      console.error('Error fetching teaching courses:', error);
    }
  };

  const handleAddCourse = async () => {
    try {
      const courseId = window.prompt('Enter Course ID (e.g., CS102):');
      if (courseId) {
        await api.post('/user-details/teaching-courses/add', { courseId });
        fetchTeachingCourses();
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };
  
  const handleRemoveCourse = async (courseId) => {
    try {
      await api.delete(`/user-details/teaching-courses/${courseId}`);
      fetchTeachingCourses(); // Refresh the list
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };
  

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
          <div className="teaching-courses-section">
            <div className="courses-list">
              {teachingCourses.map(course => (
                <div key={course._id} className="course-item">
                  <span>{course.courseName}</span>
                  <button onClick={() => handleRemoveCourse(course._id)}>Remove</button>
                </div>
              ))}
              <button onClick={handleAddCourse}>Add New Course</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPersonalDetails;