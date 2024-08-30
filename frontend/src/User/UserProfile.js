import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser || !storedUser.googleId) {
        // Redirect or handle the case where the user is not logged in
        window.location.href = '/LoginPage';
        return;
      }

      try {
        const res = await axios.get(`https://rappo.onrender.com/api/profile?googleId=${storedUser.googleId}`);
        setUser(res.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        window.location.href = '/LoginPage'; // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Profile</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={user.avatar} alt="User Avatar" style={{ borderRadius: '50%', width: '100px', height: '100px', marginRight: '20px' }} />
        <div>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Google ID: {user.googleId}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
