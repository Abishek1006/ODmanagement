import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
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
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [currentSemester, setCurrentSemester] = useState('');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('');

  useEffect(() => {
    fetchUserDetails();
    fetchAllTeachers();
    fetchEnrolledCourses();
  }, []);
  const fetchAllTeachers = async () => {
    try {
      const response = await api.get('/user-details/all-teachers');
      setAllTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to load teachers');
    }
  };

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

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.getEnrolledCourses();
      console.log('Enrolled courses:', response.data); // Debug log
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setError('Failed to load enrolled courses');
    }
  };
  const handleCourseSearch = async () => {
    try {
      const response = await api.get(`/courses/search/${courseInput}`);
      setSelectedCourse(response.data);
      setAvailableTeachers(response.data.teachers);
    } catch (error) {
      setError('Course not found');
    }
  };
  
  const handleAddCourse = async () => {
    try {
      if (!currentSemester || !currentAcademicYear) {
        setError('Please enter semester and academic year');
        return;
      }
      
      await api.enrollInCourse({
        courseId: selectedCourse.courseId, // Using courseId like "CS101"
        teacherStaffId: selectedTeacher, // Using staffId instead of MongoDB ID
        semester: currentSemester,
        academicYear: currentAcademicYear
      });
      await fetchEnrolledCourses();
      resetForm();
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course');
    }
  };
  

const handleDeleteCourse = async (courseId) => {
  try {
    await api.deleteCourseEnrollment(courseId);
    await fetchEnrolledCourses();
  } catch (error) {
    console.error('Error deleting course:', error);
    setError('Failed to delete course');
  }
};


  const resetForm = () => {
    setCourseInput('');
    setSelectedTeacher('');
    setSelectedCourse(null);
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
                    <option key={teacher._id} value={teacher.staffId}>
                      {teacher.name} ({teacher.staffId})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  placeholder="Semester"
                />
                <input
                  type="text"
                  value={currentAcademicYear}
                  onChange={(e) => setCurrentAcademicYear(e.target.value)}
                  placeholder="Academic Year"
                />
                <button onClick={handleAddCourse}>Add Course</button>
              </div>
            )}
          <ul className="courses-list">
            {enrolledCourses.map(enrollment => (
              <li key={enrollment._id}>
                {enrollment.courseId.courseName} - {enrollment.teacherId.name}
                <button onClick={() => handleDeleteCourse(enrollment.courseId._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;

// Add this function before the useEffect

