// src/services/api.js
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Verify this matches your backend
});
// Add this debug logging
api.interceptors.request.use(config => {
  console.log('Request Config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});
const getUserRoles = () => {
  const userRoles = localStorage.getItem('userRoles');
  return userRoles ? JSON.parse(userRoles) : { primaryRole: '', secondaryRoles: [], isLeader: false };
};

const getUserDetails = () => {
  const details = localStorage.getItem('userDetails');
  return details ? JSON.parse(details) : null;
};


api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers
  });
  return config;
});

api.setUserRoles = (primaryRole, secondaryRoles, isLeader) => {
  localStorage.setItem('userRoles', JSON.stringify({ primaryRole, secondaryRoles, isLeader }));
};

api.setUserDetails = (details) => {
  const userDetails = {
    ...details,
    tutorId: details.tutorId,
    acId: details.acId,
    hodId: details.hodId,
    _id: details._id
  };
  localStorage.setItem('userDetails', JSON.stringify(userDetails));
};



// Add this interceptor for detailed error logging
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      config: error.config,
      response: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Add these methods to your existing api service
const enrollInCourse = (courseData) => {
  return api.post('/user-details/courses/enroll', courseData);
};

const getEnrolledCourses = () => {
  return api.get('/user-details/courses/enrolled');
};

const deleteCourseEnrollment = (courseId) => {
  return api.delete(`/user-details/courses/${courseId}`);
};

api.enrollInCourse = enrollInCourse;
api.getEnrolledCourses = getEnrolledCourses;
api.deleteCourseEnrollment = deleteCourseEnrollment;
// Add this method to your api service
const getStudentsWithOD = (courseId) => {
  return api.get(`/courses/${courseId}/students-with-od`)
    .catch(error => {
      console.error('Detailed API Error:', {
        response: error.response,
        request: error.request,
        message: error.message
      });
      throw error; // Re-throw to allow component to handle
    });
};
api.getStudentsWithOD = getStudentsWithOD;

api.getUserRoles = getUserRoles;
api.getUserDetails = getUserDetails;
export default api;

// Add this method to your existing api service
const getODHistory = () => {
  return api.get('/od/history');
};

api.getODHistory = getODHistory;
