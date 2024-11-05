import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/PersonalDetails.css';

const PersonalDetails = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseInput, setCourseInput] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [tutorId, setTutorId] = useState('');
  const [acId, setAcId] = useState('');
  const [hodId, setHodId] = useState('');

  useEffect(() => {
    fetchUserDetails();
    fetchAllTeachers();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get('/user-details');
      setUserDetails(response.data);
      setTutorId(response.data.tutorId?._id || '');
      setAcId(response.data.acId?._id || '');
      setHodId(response.data.hodId?._id || '');
      setLoading(false);
    } catch (error) {
      setError('Failed to load user details');
      setLoading(false);
    }
  };

  const fetchAllTeachers = async () => {
    try {
      const response = await api.get('/user-details/all-teachers');
      setAllTeachers(response.data);
    } catch (error) {
      setError('Failed to load teachers');
    }
  };

  const handleCourseSearch = async () => {
    try {
      const response = await api.get(`/courses/search/${courseInput}`);
      setSelectedCourse(response.data);
      const teachersResponse = await api.get(`/user-details/course-teachers/${response.data._id}`);
      setAvailableTeachers(teachersResponse.data);
    } catch (error) {
      setError('Course not found');
    }
  };

  const handleAddCourse = async () => {
    try {
      await api.post('/user-details/courses', {
        courseId: selectedCourse._id,
        teacherId: selectedTeacher
      });
      fetchUserDetails();
      setCourseInput('');
      setSelectedTeacher('');
      setSelectedCourse(null);
    } catch (error) {
      setError('Failed to add course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/user-details/courses/${courseId}`);
      fetchUserDetails();
    } catch (error) {
      setError('Failed to delete course');
    }
  };

  const handleUpdateMentors = async () => {
    try {
      await api.put('/user-details/mentors', {
        tutorId,
        acId,
        hodId
      });
      fetchUserDetails();
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update mentors');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="personal-details">
      <h2>Personal Details</h2>
      <div className="details-view">
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Roll Number:</strong> {userDetails.rollNo}</p>
        <p><strong>Department:</strong> {userDetails.department}</p>

        <div className="mentors-section">
          <h3>Mentors</h3>
          <p><strong>Tutor:</strong> {userDetails.tutorId?.name || 'Not Assigned'}</p>
          <p><strong>AC:</strong> {userDetails.acId?.name || 'Not Assigned'}</p>
          <p><strong>HOD:</strong> {userDetails.hodId?.name || 'Not Assigned'}</p>
          
          {isEditing && (
            <div className="mentor-selection">
              <select value={tutorId} onChange={(e) => setTutorId(e.target.value)}>
                <option value="">Select Tutor</option>
                {allTeachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                ))}
              </select>
              <select value={acId} onChange={(e) => setAcId(e.target.value)}>
                <option value="">Select AC</option>
                {allTeachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                ))}
              </select>
              <select value={hodId} onChange={(e) => setHodId(e.target.value)}>
                <option value="">Select HOD</option>
                {allTeachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                ))}
              </select>
              <button onClick={handleUpdateMentors}>Update Mentors</button>
            </div>
          )}
        </div>

        <div className="courses-section">
          <h3>Enrolled Courses</h3>
          <div className="course-search">
            <input
              type="text"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              placeholder="Enter Course ID"
            />
            <button onClick={handleCourseSearch}>Search Course</button>
          </div>

          {selectedCourse && (
            <div className="course-add">
              <p>Found: {selectedCourse.courseName}</p>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">Select Teacher</option>
                {availableTeachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddCourse}>Add Course</button>
            </div>
          )}

          <ul className="courses-list">
            {userDetails.courses?.map(course => (
              <li key={course.courseId._id}>
                {course.courseId.courseName} - {course.teacherId.name}
                <button onClick={() => handleDeleteCourse(course.courseId._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel Editing' : 'Edit Details'}
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;