// src/services/eventService.js
import axios from 'axios';

const API_URL = '/api/events';

export const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const registerForEvent = async (eventId) => {
  const response = await axios.post(`${API_URL}/${eventId}/register`);
  return response.data;
};

export const requestOD = async (eventId) => {
  const response = await axios.post('/api/od', { eventId });
  return response.data;
};
