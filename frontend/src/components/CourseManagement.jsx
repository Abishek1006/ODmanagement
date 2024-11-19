import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
// import '../css/CourseManagement.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await api.get('/courses/teacher-courses');
      setCourses(response.data);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/teacher/courses/${courseId}`);  // Updated path
  };

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="course-management">
      <h2>My Courses</h2>
      <div className="courses-grid">
        {courses.map(course => (
          <div 
            key={course._id} 
            className="course-card"
            onClick={() => handleCourseClick(course._id)}
          >
            <h3>{course.courseName}</h3>
            <p>Course ID: {course.courseId}</p>
            <p>Department: {course.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;