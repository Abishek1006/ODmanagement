import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaUser, FaEnvelope, FaIdBadge, FaBuilding, FaChalkboardTeacher, FaBook, FaSearch, FaPlus, FaTrash, FaImage } from 'react-icons/fa';

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
    hodId: '',
  });
  const [image, setImage] = useState(null);

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
        hodId: response.data.hodId?._id || '',
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
        academicYear: currentAcademicYear,
      });

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


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 700 * 1024) {
      setError('Image size must be less than 700KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('Image data:', reader.result); // Log the image data
      setImage(reader.result); // Base64 encoded string
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      console.log('Image size:', image.length / 1024, 'KB');
      console.log('Attempting to upload image...');

      const response = await api.put('/user-details', {
        profilePicture: image,
      });
      console.log('Upload response:', response);

      setUserDetails(response.data);
      setImage(null);
      setError(null);
      alert('Profile picture updated successfully!');
    } catch (err) {
      console.log('Upload error details:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        error: err,
      });
      setError(err.response?.data?.message || 'Failed to upload image');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaUser className="mr-2" /> Personal Details
      </h2>
      <div className="space-y-6">
        <div className="basic-details">
          <div className="flex items-center space-x-4">
            {userDetails.profilePicture && (
              <img
                src={userDetails.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-gray-700 dark:text-gray-300 flex items-center">
                <FaUser className="mr-2" /> <strong>Name:</strong> {userDetails.name}
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center">
                <FaEnvelope className="mr-2" /> <strong>Email:</strong> {userDetails.email}
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center">
                <FaIdBadge className="mr-2" /> <strong>Roll Number:</strong> {userDetails.rollNo}
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center">
                <FaBuilding className="mr-2" /> <strong>Department:</strong> {userDetails.department}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="mb-2"
            />
            <button
              onClick={handleImageUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
            >
              <FaImage className="mr-2" /> Upload Profile Picture
            </button>
          </div>
        </div>



        <div className="courses-section">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaBook className="mr-2" /> Enrolled Courses
          </h3>
          <div className="course-search flex space-x-2">
            <input
              type="text"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              placeholder="Enter Course ID"
              className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            />
            <button
              onClick={handleCourseSearch}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center"
            >
              <FaSearch className="mr-2" /> Search Course
            </button>
          </div>
          {selectedCourse && (
            <div className="course-add space-y-4 mt-4">
              <p className="text-gray-700 dark:text-gray-300">Found: {selectedCourse.courseName}</p>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              >
                <option value="">Select Teacher</option>
                {availableTeachers.map((teacher) => (
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
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              />
              <input
                type="text"
                value={currentAcademicYear}
                onChange={(e) => setCurrentAcademicYear(e.target.value)}
                placeholder="Academic Year"
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              />
              <button
                onClick={handleAddCourse}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Course
              </button>
            </div>
          )}
          <ul className="courses-list mt-4 space-y-2">
            {enrolledCourses.map((enrollment) => (
              <li
                key={enrollment._id}
                className="flex justify-between items-center bg-orange-50 dark:bg-gray-700 p-2 rounded-lg"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {enrollment.courseId.courseName} - {enrollment.teacherId.name}
                </span>
                <button
                  onClick={() => handleDeleteCourse(enrollment.courseId._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
                >
                  <FaTrash className="mr-1" /> Delete
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