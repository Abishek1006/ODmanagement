import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events'; // Replace with your actual backend URL

// Create an axios instance with default headers
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your actual backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.response?.data || error.message);
    throw error;
  }
};

export const registerForEvent = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error.response?.data || error.message);
    throw error;
  }
};

export const requestOD = async (eventId) => {
  try {
    const response = await api.post('/od', { eventId });
    return response.data;
  } catch (error) {
    console.error('Error requesting OD:', error.response?.data || error.message);
    throw error;
  }
};