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
    profilePicture: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachingCourses, setTeachingCourses] = useState([]);
  const [image, setImage] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
          profilePicture: userDetailsResponse.data.profilePicture || '',
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
      setIsUploadModalOpen(false);
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

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Upload Profile Picture</h3>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full mb-4 p-2 border rounded dark:border-gray-600 dark:text-gray-300"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleImageUpload}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center items-center h-64 text-lg">Loading teacher details...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          {teacherDetails.profilePicture ? (
            <img
              src={teacherDetails.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <FaUser className="text-4xl text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
          >
            <FaImage />
          </button>
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold dark:text-white">{teacherDetails.name}</h2>
          <span className="text-gray-600 dark:text-gray-400">{teacherDetails.staffId}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 mt-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <FaBook className="mr-2" /> Teaching Courses
        </h3>
        <div className="space-y-3">
          {teachingCourses.map((course) => (
            <div
              key={course._id}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
            >
              <span>{course.courseName}</span>
              <button
                onClick={() => handleRemoveCourse(course._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button onClick={handleAddCourse} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <FaPlus className="mr-2" /> Add New Course
          </button>
        </div>
      </div>

      {isUploadModalOpen && <UploadModal />}
    </div>
  );
};

export default TeacherPersonalDetails;