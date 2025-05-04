// src/services/api.js
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../utils/cookieUtils';
const api = axios.create({
  baseURL: 'https://od-management.onrender.com/api',
  //baseURL: 'http://localhost:5000/api',
  withCredentials: true // This is crucial for cookies to be sent with requests
});

api.logout = () => {
  removeCookie('token');
  removeCookie('userRoles');
  removeCookie('userDetails');
  // Clear any other auth-related cookies
}; 

// Debug logging for requests
api.interceptors.request.use((config) => {
  const token = getCookie('token');
  if (token) 
  {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

// Debug logging for responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      config: error.config,
      response: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Helper functions for user roles and details
const getUserRoles = () => {
  return getCookie('userRoles') || { primaryRole: '', secondaryRoles: [], isLeader: false };
};

const getUserDetails = () => {
  return getCookie('userDetails') || null;
};

api.setUserRoles = (primaryRole, secondaryRoles, isLeader) => {
  setCookie('userRoles', { primaryRole, secondaryRoles, isLeader });
};

api.setUserDetails = (details) => {
  const userDetails = {
    ...details,
    tutorId: details.tutorId,
    acId: details.acId,
    hodId: details.hodId,
    _id: details._id,
    semester: details.semester 
  };
  setCookie('userDetails', userDetails);
};

// Course-related methods
const enrollInCourse = (courseData) => {
  return api.post('/user-details/courses/enroll', courseData);
};

const getEnrolledCourses = () => {
  return api.get('/user-details/courses/enrolled');
};

const deleteCourseEnrollment = (courseId) => {
  return api.delete(`/user-details/courses/${courseId}`);
};

// OD-related methods
const getStudentsWithOD = (courseId) => {
  return api.get(`/courses/${courseId}/students-with-od`).catch((error) => {
    console.error('Detailed API Error:', {
      response: error.response,
      request: error.request,
      message: error.message,
    });
    throw error; // Re-throw to allow component to handle
  });
};

const getODHistory = () => {
  return api.get('/od/history');
};

const getRejectedODs = () => {
  return api.get('/od/rejected-requests');
};

const reconsiderOD = (odId) => {
  return api.post(`/od/${odId}/reconsider`);
};

//for admin privialeges
// Add these to your existing api object
api.createUser = (userData) => {
  return api.post('/admin/users', userData);
};

api.getAllUsers = () => {
  return api.get('/admin/users');
};

api.createCourse = (courseData) => {
  return api.post('/admin/courses', courseData);
};

api.getAllCourses = () => {
  return api.get('/admin/courses');
};




// Profile picture upload method
const uploadProfilePicture = (imageData) => {
  return api.put('/user-details', { profilePicture: imageData });
};

api.uploadProfilePicture = uploadProfilePicture;


// Add specific methods for hierarchical approvals
api.getTeacherODRequests = () => {
  return api.get('/od/teacher-requests')
    .then(response => {
      console.log('API Response:', response);
      return response;
    })
    .catch(error => {
      console.error('API Error:', error);
      throw error;
    });
};

api.getApprovalStatus = () => {
  return api.get('/od/approval-status');
};

api.approveOD = (odId, status) => {
  return api.patch(`/od/${odId}/teacher-approval`, { status });
};
// Add to existing api methods
api.getStudentODDetails = (studentId, semester) => {
  return api.get(`/od/student-od-details/${studentId}/${semester}`);
};
api.getStudentSemesterReport = (semester) => {
  const userRoles = getUserRoles();
  if (userRoles.primaryRole !== 'tutor') {
    throw new Error('Unauthorized access');
  }
  return api.get(`/od/student-semester-report?semester=${semester}`);
};

api.downloadSemesterReportPDF = (semester) => {
  const userRoles = getUserRoles();
  if (userRoles.primaryRole !== 'tutor') {
    throw new Error('Unauthorized access');
  }
  return api.get(`/od/student-semester-report/${semester}/download-pdf`, {
    responseType: 'blob'
  });
};
// Add this method to your api.js file if it's not already there

// Batch update semester method
api.batchUpdateSemester = (fromSemester, toSemester, department) => {
  return api.post('/admin/batch-update-semester', {
    fromSemester,
    toSemester,
    department
  });
};



// Assign methods to the api object
api.enrollInCourse = enrollInCourse;
api.getEnrolledCourses = getEnrolledCourses;
api.deleteCourseEnrollment = deleteCourseEnrollment;
api.getStudentsWithOD = getStudentsWithOD;
api.getODHistory = getODHistory;
api.getRejectedODs = getRejectedODs;
api.reconsiderOD = reconsiderOD;
api.getUserRoles = getUserRoles;
api.getUserDetails = getUserDetails;

// Add this to your api.js file

export default api;