import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const response = await api.get('/courses/teacher-courses');
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/teacher-dashboard/courses/${courseId}/details`); // Update this path
  };
  

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="course-management">
      <h2>My Courses</h2>
      <div className="courses-list">
        {courses.length > 0 ? (
          courses.map(course => (
            <div 
              key={course._id} 
              className="course-item"
              onClick={() => handleCourseClick(course._id)}
            >
              <h3>{course.courseName}</h3>
              {course.courseId && <p>Course Code: {course.courseId}</p>}
              {course.department && <p>Department: {course.department}</p>}
            </div>
          ))
        ) : (
          <p>No courses assigned</p>
        )}
      </div>
    </div>
  );
};
export default CourseManagement;