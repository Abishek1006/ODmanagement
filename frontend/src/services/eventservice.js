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
    
    if (!userDetails || !userDetails._id || !userDetails.tutorId || !userDetails.acId || !userDetails.hodId) {
      throw new Error('User details not complete. Please log in again.');
    }

    const requestData = {
      ...odData,
      studentId: userDetails._id,
      tutorId: userDetails.tutorId,
      acId: userDetails.acId,
      hodId: userDetails.hodId
    };
    
    const endpoint = odData.isExternal ? '/od/external' : '/od';
    const response = await api.post(endpoint, requestData);
    return response.data;
  } catch (error) {
    console.error('Error requesting OD:', error);
    throw error;
  }
};