import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile">
      <h2>Profile</h2>
      {profile && (
        <>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
          {profile.role === 'student' && (
            <>
              <p>Roll No: {profile.rollNo}</p>
              <p>Department: {profile.department}</p>
              <p>Is Leader: {profile.isLeader ? 'Yes' : 'No'}</p>
            </>
          )}
          {profile.role !== 'student' && (
            <>
              <p>Staff ID: {profile.staffId}</p>
              <p>Department: {profile.department}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
