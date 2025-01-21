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
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [currentSemester, setCurrentSemester] = useState('');
  const [currentAcademicYear, setCurrentAcademicYear] = useState('');
  const [selectedMentors, setSelectedMentors] = useState({
    tutorId: '',
    acId: '',
    hodId: ''
  });

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
      setSelectedMentors({
        tutorId: response.data.tutorId?._id || '',
        acId: response.data.acId?._id || '',
        hodId: response.data.hodId?._id || ''
      });
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
      setError(null);
    } catch (error) {
      setError('Course not found');
      setSelectedCourse(null);
      setAvailableTeachers([]);
    }
  };
  
  
const handleAddCourse = async () => {
  try {
    if (!currentSemester || !currentAcademicYear) {
      setError('Please enter semester and academic year');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to add this course?');
    if (!confirmed) return;
    
    await api.enrollInCourse({
      courseId: selectedCourse.courseId,
      teacherStaffId: selectedTeacher,
      semester: currentSemester,
      academicYear: currentAcademicYear
    });

    // Refresh only enrolled courses
    await fetchEnrolledCourses();
    resetForm();
    setError(null);
    alert('Course added successfully!');
  } catch (error) {
    setError('Failed to add course');
  }
};
const handleDeleteCourse = async (courseId) => {
  try {
    const confirmed = window.confirm('Are you sure you want to delete this course? This action cannot be undone.');
    if (!confirmed) return;

    await api.deleteCourseEnrollment(courseId);
    // Refresh only enrolled courses
    await fetchEnrolledCourses();
    setError(null);
    alert('Course deleted successfully!');
  } catch (error) {
    setError('Failed to delete course');
  }
};

  const resetForm = () => {
    setCourseInput('');
    setSelectedTeacher('');
    setSelectedCourse(null);
  };

  const handleMentorChange = async () => {
    try {
      if (!selectedMentors.tutorId && !selectedMentors.acId && !selectedMentors.hodId) {
        setError('Please select at least one mentor');
        return;
      }
  
      const confirmed = window.confirm('Are you sure you want to update your mentors?');
      if (!confirmed) return;
  
      await api.put('/user-details/update-mentors', selectedMentors);
      await fetchUserDetails(); // Only refresh user details
      setIsEditing(false);
      setError(null);
      alert('Mentors updated successfully!');
    } catch (error) {
      setError('Failed to update mentors');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="personal-details">
      <h2>Personal Details</h2>
      <div className="details-section">
        <div className="basic-details">
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Roll Number:</strong> {userDetails.rollNo}</p>
          <p><strong>Department:</strong> {userDetails.department}</p>
        </div>

        <div className="mentors-section">
          <h3>Mentors</h3>
          {!isEditing ? (
            <div className="mentors-display">
              <p><strong>Tutor:</strong> {userDetails.tutorId?.name || 'Not assigned'}</p>
              <p><strong>Academic Coordinator:</strong> {userDetails.acId?.name || 'Not assigned'}</p>
              <p><strong>HOD:</strong> {userDetails.hodId?.name || 'Not assigned'}</p>
              <button onClick={() => setIsEditing(true)}>Change Mentors</button>
            </div>
          ) : (
            <div className="mentors-edit">
              <div className="mentor-select">
                <label>Tutor:</label>
                <select
                  value={selectedMentors.tutorId}
                  onChange={(e) => setSelectedMentors({...selectedMentors, tutorId: e.target.value})}
                >
                  <option value="">Select Tutor</option>
                  {allTeachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mentor-select">
                <label>Academic Coordinator:</label>
                <select
                  value={selectedMentors.acId}
                  onChange={(e) => setSelectedMentors({...selectedMentors, acId: e.target.value})}
                >
                  <option value="">Select AC</option>
                  {allTeachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mentor-select">
                <label>HOD:</label>
                <select
                  value={selectedMentors.hodId}
                  onChange={(e) => setSelectedMentors({...selectedMentors, hodId: e.target.value})}
                >
                  <option value="">Select HOD</option>
                  {allTeachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mentor-actions">
                <button onClick={handleMentorChange}>Save Changes</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
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
