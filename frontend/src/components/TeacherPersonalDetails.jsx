import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/PersonalDetails.css';

const TeacherPersonalDetails = () => {
  const [teacherDetails, setTeacherDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await api.get('/teacher-details');
        setTeacherDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load teacher details');
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, []);

  const handleUpdateDetails = async () => {
    try {
      await api.put('/teacher-details', teacherDetails);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update details');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="teacher-personal-details">
      <h2>Teacher Personal Details</h2>
      <div className="details-section">
        <div className="detail-row">
          <label>Name:</label>
          {isEditing ? (
            <input 
              type="text" 
              value={teacherDetails.name} 
              onChange={(e) => setTeacherDetails({...teacherDetails, name: e.target.value})}
            />
          ) : (
            <span>{teacherDetails.name}</span>
          )}
        </div>
        <div className="detail-row">
          <label>Email:</label>
          {isEditing ? (
            <input 
              type="email" 
              value={teacherDetails.email} 
              onChange={(e) => setTeacherDetails({...teacherDetails, email: e.target.value})}
            />
          ) : (
            <span>{teacherDetails.email}</span>
          )}
        </div>
        <div className="detail-row">
          <label>Department:</label>
          {isEditing ? (
            <input 
              type="text" 
              value={teacherDetails.department} 
              onChange={(e) => setTeacherDetails({...teacherDetails, department: e.target.value})}
            />
          ) : (
            <span>{teacherDetails.department}</span>
          )}
        </div>

        <div className="actions">
          {isEditing ? (
            <>
              <button onClick={handleUpdateDetails}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Details</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPersonalDetails;
