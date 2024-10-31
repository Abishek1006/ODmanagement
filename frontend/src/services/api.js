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
    const { primaryRole, secondaryRoles, isLeader } = getUserRoles();
    const userDetails = getUserDetails();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    config.headers['X-Primary-Role'] = primaryRole;
    config.headers['X-Secondary-Roles'] = JSON.stringify(secondaryRoles);
    config.headers['X-Is-Leader'] = isLeader.toString();

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