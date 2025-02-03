import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    courseId: '',
    courseName: '',
    department: '',
    semester: '',
    academicYear: ''
  });
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/courses', newCourse);
      fetchCourses();
      setNewCourse({
        courseId: '',
        courseName: '',
        department: '',
        semester: '',
        academicYear: ''
      });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEditCourse = async (courseId) => {
    const course = courses.find(c => c._id === courseId);
    setEditingCourse(course);
    setNewCourse({
      courseId: course.courseId,
      courseName: course.courseName,
      department: course.department,
      semester: course.semester,
      academicYear: course.academicYear
    });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/courses/${editingCourse._id}`, newCourse);
      setEditingCourse(null);
      fetchCourses();
      setNewCourse({
        courseId: '',
        courseName: '',
        department: '',
        semester: '',
        academicYear: ''
      });
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/admin/courses/${courseId}`);
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      await handleUpdateCourse(e);
    } else {
      await handleCreateCourse(e);
    }
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setNewCourse({
      courseId: '',
      courseName: '',
      department: '',
      semester: '',
      academicYear: ''
    });
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {editingCourse ? 'Edit Course' : 'Create New Course'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(newCourse).map((key) => (
            <input
              key={key}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={newCourse[key]}
              onChange={(e) => setNewCourse({ ...newCourse, [key]: e.target.value })}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingCourse ? 'Update Course' : 'Create Course'}
          </button>
          {editingCourse && (
            <button 
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
  
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Courses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{course.courseId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.courseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.academicYear}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleEditCourse(course._id)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button onClick={() => handleDeleteCourse(course._id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseManagement;
