// Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from localStorage
          },
        });
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.firstname}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {/* Add other user details as necessary */}
    </div>
  );
};

export default Profile;
