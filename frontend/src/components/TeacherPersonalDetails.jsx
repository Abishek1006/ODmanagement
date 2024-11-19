import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/teacher.css';

const TeacherPersonalDetails = () => {
  const [teacherDetails, setTeacherDetails] = useState({
    name: '',
    email: '',
    department: '',
    staffId: '',
    courses: [],
    primaryRole: 'teacher'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableTeachers, setAvailableTeachers] = useState([]);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        // Fetch teacher's personal details
        const userDetailsResponse = await api.get('/user-details');
        setTeacherDetails(userDetailsResponse.data);
        
        // Fetch all available teachers for potential course assignments
        const teachersResponse = await api.get('/user-details/all-teachers');
        setAvailableTeachers(teachersResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        setError('Failed to load teacher details');
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, []);

  const handleUpdateDetails = async () => {
    try {
      // Change from PUT to POST or modify backend route
      const response = await api.put('/user-details', teacherDetails);
      setTeacherDetails(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update details: ' + error.response?.data?.message);
    }
  };

  const handleAddCourse = async (courseId, teacherId) => {
    try {
      const response = await api.post('/user-details/courses', { 
        courseId, 
        teacherId 
      });
      setTeacherDetails(response.data);
    } catch (error) {
      console.error('Add course error:', error);
      setError('Failed to add course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/user-details/courses/${courseId}`);
      // Refresh teacher details after deletion
      const updatedDetails = await api.get('/user-details');
      setTeacherDetails(updatedDetails.data);
    } catch (error) {
      console.error('Delete course error:', error);
      setError('Failed to delete course');
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
          {isEditing ? (
            <input 
              type="text" 
              value={teacherDetails.name} 
              onChange={(e) => setTeacherDetails({...teacherDetails, name: e.target.value})}
            />
          ) : (
            <span>{teacherDetails.name}</span>
          )}
        </div>

        <div className="detail-row">
          <label>Email:</label>
          {isEditing ? (
            <input 
              type="email" 
              value={teacherDetails.email} 
              onChange={(e) => setTeacherDetails({...teacherDetails, email: e.target.value})}
            />
          ) : (
            <span>{teacherDetails.email}</span>
          )}
        </div>

        <div className="detail-row">
          <label>Staff ID:</label>
          {isEditing ? (
            <input 
              type="text" 
              value={teacherDetails.staffId} 
              onChange={(e) => setTeacherDetails({...teacherDetails, staffId: e.target.value})}
            />
          ) : (
            <span>{teacherDetails.staffId}</span>
          )}
        </div>

        <div className="detail-row">
          <label>Department:</label>
          {isEditing ? (
            <input 
              type="text" 
              value={teacherDetails.department} 
              onChange={(e) => setTeacherDetails({...teacherDetails, department: e.target.value})}
            />
          ) : (
            <span>{teacherDetails.department}</span>
          )}
        </div>

        <div className="courses-section">
          <h3>Courses</h3>
          {teacherDetails.courses && teacherDetails.courses.map((course, index) => (
            <div key={index} className="course-item">
              <span>{course.courseId.name}</span>
              {isEditing && (
                <button onClick={() => handleDeleteCourse(course.courseId._id)}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="actions">
          {isEditing ? (
            <>
              <button onClick={handleUpdateDetails}>Save Changes</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPersonalDetails;