import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PersonalDetails = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user-details');
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details. Please try again later.');
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user-details', userDetails);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
      {!isEditing ? (
        <div>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Roll Number: {userDetails.rollNo}</p>
          <p>Department: {userDetails.department}</p>
          <button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4">
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <input name="name" value={userDetails.name} onChange={handleChange} />
          <input name="email" value={userDetails.email} onChange={handleChange} />
          <input name="rollNo" value={userDetails.rollNo} onChange={handleChange} />
          <input name="department" value={userDetails.department} onChange={handleChange} />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4 ml-2">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default PersonalDetails;
