import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaUser, FaEnvelope, FaIdBadge, FaBuilding, FaBook, FaPlus, FaTrash, FaImage } from 'react-icons/fa';

const TeacherPersonalDetails = () => {
  const [teacherDetails, setTeacherDetails] = useState({
    name: '',
    email: '',
    department: '',
    staffId: '',
    courses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachingCourses, setTeachingCourses] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const userDetailsResponse = await api.get('/user-details');
        setTeacherDetails({
          name: userDetailsResponse.data.name || '',
          email: userDetailsResponse.data.email || '',
          department: userDetailsResponse.data.department || '',
          staffId: userDetailsResponse.data.staffId || '',
          courses: userDetailsResponse.data.courses || [],
          profilePicture: userDetailsResponse.data.profilePicture || '', // Add this line
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        setError('Failed to load teacher details');
        setLoading(false);
      }
    };
    

    fetchTeacherDetails();
    fetchTeachingCourses();
  }, []);

  const fetchTeachingCourses = async () => {
    try {
      const response = await api.get('/courses/teacher-courses');
      setTeachingCourses(response.data);
    } catch (error) {
      console.error('Error fetching teaching courses:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 700 * 1024) {
      setError('Image size must be less than 700KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      const response = await api.put('/user-details', {
        profilePicture: image,
      });

      setTeacherDetails((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));
      setImage(null);
      setError(null);
      alert('Profile picture updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    }
  };

  const handleAddCourse = async () => {
    try {
      const courseId = window.prompt('Enter Course ID (e.g., CS102):');
      if (courseId) {
        const confirmed = window.confirm(`Are you sure you want to add course ${courseId}?`);
        if (confirmed) {
          await api.post('/user-details/teaching-courses/add', { courseId });
          fetchTeachingCourses();
          alert('Course added successfully!');
        }
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handleRemoveCourse = async (courseId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to remove this course? This action cannot be undone.');
      if (confirmed) {
        await api.delete(`/user-details/teaching-courses/${courseId}`);
        fetchTeachingCourses();
        alert('Course removed successfully!');
      }
    } catch (error) {
      console.error('Error removing course:', error);
      alert('Failed to remove course. Please try again.');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading teacher details...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaUser className="mr-2" /> Teacher Profile
      </h2>
      <div className="flex items-center space-x-4 mb-4">
        {teacherDetails.profilePicture && (
          <img
            src={teacherDetails.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div className="flex flex-col space-y-2">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          <button
            onClick={handleImageUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
            transition-colors duration-300 flex items-center"
          >
            <FaImage className="mr-2" /> Upload Profile Picture
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaUser className="mr-2" /> <strong>Name:</strong> {teacherDetails.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaEnvelope className="mr-2" /> <strong>Email:</strong> {teacherDetails.email}
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaIdBadge className="mr-2" /> <strong>Staff ID:</strong> {teacherDetails.staffId}
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex items-center">
              <FaBuilding className="mr-2" /> <strong>Department:</strong> {teacherDetails.department}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaBook className="mr-2" /> Teaching Courses
          </h3>
          <div className="space-y-2">
            {teachingCourses.map((course) => (
              <div
                key={course._id}
                className="flex justify-between items-center bg-orange-50 dark:bg-gray-700 p-2 rounded-lg"
              >
                <span className="text-gray-700 dark:text-gray-300">{course.courseName}</span>
                <button
                  onClick={() => handleRemoveCourse(course._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
                >
                  <FaTrash className="mr-1" /> Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddCourse}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
            >
              <FaPlus className="mr-2" /> Add New Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPersonalDetails;
