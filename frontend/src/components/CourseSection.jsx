import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CourseSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/courses', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="course-section">
      <h2>My Courses</h2>
      {courses.map(course => (
        <div key={course._id} className="course">
          <h3>{course.name}</h3>
          <p>Students: {course.students.map(student => student.name).join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseSection;