import React, { useState, useEffect } from 'react';
import api from '../services/api';
// import '../css/CourseManagement.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/teacher/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelect = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/students`);
      setSelectedCourse({
        ...courses.find(course => course._id === courseId),
        students: response.data
      });
    } catch (error) {
      setError('Failed to load course details');
    }
  };

  if (loading) return <div>Loading Courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="course-management">
      <div className="courses-list">
        <h2>My Courses</h2>
        {courses.map(course => (
          <div 
            key={course._id} 
            className="course-card"
            onClick={() => handleCourseSelect(course._id)}
          >
            <h3>{course.courseName}</h3>
            <p>Department: {course.department}</p>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div className="course-details">
          <h2>{selectedCourse.courseName} Students</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>OD Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourse.students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.odStatus || 'No OD'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
