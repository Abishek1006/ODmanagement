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
    console.log('OD Request Data:', odData);
    const userDetails = api.getUserDetails();
    
    if (!userDetails || !userDetails._id || !userDetails.tutorId || !userDetails.acId || !userDetails.hodId || !odData.semester) {
      console.log('Missing user details:', userDetails);
      throw new Error('User details not complete');
    }

    const requestPayload = {
      ...odData,
      studentId: userDetails._id,
      tutorId: userDetails.tutorId,
      acId: userDetails.acId,
      hodId: userDetails.hodId,
      semester: odData.semester // Explicitly ensure semester is included
    };
    
    console.log('Final Request Payload:', requestPayload);
    const endpoint = odData.isExternal ? '/od/external' : '/od';
    const response = await api.post(endpoint, requestPayload);
    console.log('OD Request Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Detailed OD Request Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
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



