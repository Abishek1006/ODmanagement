import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaBook, FaArrowRight } from 'react-icons/fa';

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
    navigate(`/teacher-dashboard/courses/${courseId}/details`);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading courses...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaBook className="mr-2" /> My Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCourseClick(course._id)}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.courseName}</h3>
              {course.courseId && (
                <p className="text-gray-700 dark:text-gray-300">Course Code: {course.courseId}</p>
              )}
              {course.department && (
                <p className="text-gray-700 dark:text-gray-300">Department: {course.department}</p>
              )}
              <div className="mt-4 flex items-center text-orange-500">
                <span>View Details</span>
                <FaArrowRight className="ml-2" />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No courses assigned</p>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;