import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/PersonalDetails.css';
const PersonalDetails = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseInput, setCourseInput] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState({});
  const [availableTeachers, setAvailableTeachers] = useState({});

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get('/user-details');
      setUserDetails(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load user details');
      setLoading(false);
    }
  };

  const handleCourseSearch = async () => {
    try {
      const response = await api.get(`/courses/${courseInput}`);
      const teachersResponse = await api.get(`/user-details/course-teachers/${courseInput}`);
      setAvailableTeachers({
        ...availableTeachers,
        [response.data._id]: teachersResponse.data
      });
    } catch (error) {
      setError('Course not found');
    }
  };

  const handleTeacherSelection = (courseId, teacherId) => {
    setSelectedTeachers({
      ...selectedTeachers,
      [courseId]: teacherId
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedCourses = Object.entries(selectedTeachers).map(([courseId, teacherId]) => ({
        courseId,
        teacherId
      }));
      
      await api.put('/user-details/courses', { courses: updatedCourses });
      setIsEditing(false);
      fetchUserDetails();
    } catch (error) {
      setError('Failed to update courses');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="personal-details">
      <h2>Personal Details</h2>
      {!isEditing ? (
        <div className="details-view">
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Roll Number:</strong> {userDetails.rollNo}</p>
          <p><strong>Department:</strong> {userDetails.department}</p>
          
          <div className="courses-section">
            <h3>Enrolled Courses:</h3>
            <ul>
              {userDetails.courses?.map(course => (
                <li key={course.courseId._id}>
                  {course.courseId.courseName} - {course.teacherId.name}
                </li>
              ))}
            </ul>
          </div>
          
          <button onClick={() => setIsEditing(true)}>Edit Details</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Add Course:</label>
            <input
              type="text"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              placeholder="Enter Course ID"
            />
            <button type="button" onClick={handleCourseSearch}>Search Course</button>
          </div>

          {Object.entries(availableTeachers).map(([courseId, teachers]) => (
            <div key={courseId} className="form-group">
              <label>Select Teacher for {courseId}:</label>
              <select
                value={selectedTeachers[courseId] || ''}
                onChange={(e) => handleTeacherSelection(courseId, e.target.value)}
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="button-group">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalDetails;