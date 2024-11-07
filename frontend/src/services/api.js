// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const getUserRoles = () => {
  const userRoles = localStorage.getItem('userRoles');
  return userRoles ? JSON.parse(userRoles) : { primaryRole: '', secondaryRoles: [], isLeader: false };
};

const getUserDetails = () => {
  const details = localStorage.getItem('userDetails');
  return details ? JSON.parse(details) : null;
};


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.setUserRoles = (primaryRole, secondaryRoles, isLeader) => {
  localStorage.setItem('userRoles', JSON.stringify({ primaryRole, secondaryRoles, isLeader }));
};

api.setUserDetails = (details) => {
  localStorage.setItem('userDetails', JSON.stringify(details));
};

api.getUserRoles = getUserRoles;
api.getUserDetails = getUserDetails;
export default api;

// Add this interceptor for detailed error logging
api.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', {
      config: error.config,
      response: error.response,
      message: error.message
    });
    return Promise.reject(error);
  }
);
