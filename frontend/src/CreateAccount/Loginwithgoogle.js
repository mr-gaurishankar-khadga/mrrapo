import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import './Loginwithgoogle.css'; 

function Loginwithgoogle() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the profile of the logged-in user
    fetch('/profile')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Not authenticated');
      })
      .then((profile) => setUser(profile))
      .catch(() => setUser(null));
  }, []);

  const login = () => {
    // Update the URL for Google login based on the environment
    window.location.href = process.env.NODE_ENV === 'production' 
      ? 'https://rappo.onrender.com/auth/google' 
      : 'http://localhost:8000/auth/google';
  };

  const logout = () => {
    // Update the URL for logout based on the environment
    window.location.href = process.env.NODE_ENV === 'production' 
      ? 'https://rappo.onrender.com/logout' 
      : 'http://localhost:8000/logout'; 
  };

  return (
    <div className="login-container">
      <Paper elevation={3} className="login-paper">
        {user ? (
          <div className="user-info">
            <Typography variant="h5" gutterBottom>
              Hello, {user.displayName}
            </Typography>
            <Button variant="contained" className="logout-button" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="login-button-container">
            <Typography variant="h5" gutterBottom>
              Welcome! Please log in
            </Typography>
            <Button 
              variant="contained" 
              className="google-login-button" 
              startIcon={<GoogleIcon />} 
              onClick={login}
            >
              Login with Google
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default Loginwithgoogle;
