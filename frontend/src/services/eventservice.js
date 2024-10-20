// src/services/eventservice.js
import api from './api';

export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const registerForEvent = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const requestOD = async (eventId) => {
  try {
    const response = await api.post('/od', { eventId });
    return response.data;
  } catch (error) {
    console.error('Error requesting OD:', error);
    throw error;
  }
};