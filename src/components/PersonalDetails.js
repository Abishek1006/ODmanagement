import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const PersonalDetails = () => {
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`/api/users/${currentUser.id}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${currentUser.id}`, userDetails);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Personal Details</h2>
      {!isEditing ? (
        <div>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Roll Number: {userDetails.rollNumber}</p>
          <p>Department: {userDetails.department}</p>
          <p>Tutor: {userDetails.tutor}</p>
          <p>AC: {userDetails.ac}</p>
          <p>HOD: {userDetails.hod}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <input name="name" value={userDetails.name} onChange={handleChange} />
          <input name="email" value={userDetails.email} onChange={handleChange} />
          <input name="rollNumber" value={userDetails.rollNumber} onChange={handleChange} />
          <input name="department" value={userDetails.department} onChange={handleChange} />
          <input name="tutor" value={userDetails.tutor} onChange={handleChange} />
          <input name="ac" value={userDetails.ac} onChange={handleChange} />
          <input name="hod" value={userDetails.hod} onChange={handleChange} />
          <button type="submit">Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default PersonalDetails;
