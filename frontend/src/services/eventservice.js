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
export const requestOD = async (odData) => {
  try {
    const userDetails = api.getUserDetails();
    console.log('User Details:', userDetails); // Debug log
    
    if (!userDetails || !userDetails._id || !userDetails.tutorId || !userDetails.acId || !userDetails.hodId || !userDetails.semester) {
      throw new Error('User details not complete - semester is required');
    }

    const requestPayload = {
      ...odData,
      studentId: userDetails._id,
      tutorId: userDetails.tutorId,
      acId: userDetails.acId,
      hodId: userDetails.hodId,
      semester: userDetails.semester
    };
    
    console.log('Request Payload:', requestPayload); // Debug log
    const endpoint = odData.isExternal ? '/od/external' : '/od';
    const response = await api.post(endpoint, requestPayload);
    return response.data;
  } catch (error) {
    console.error('RequestOD Error:', error);
    throw error;
  }
};

export const getEventStudentsWithOD = async (eventId) => {
  try {
    console.log('Making API request for event:', eventId);
    const response = await api.get(`/od/event/${eventId}/students`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching event students:', error);
    throw error;
  }
};



