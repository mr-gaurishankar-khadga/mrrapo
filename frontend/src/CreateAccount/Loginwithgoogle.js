// LoginWithGoogle.js
import React, { useState, useEffect } from 'react';
import { Button, Typography, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
// import './LoginWithGoogle.css';

const Loginwithgoogle = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/profile', {
          credentials: 'include', // Important for session handling
        });
        if (!response.ok) throw new Error('Not authenticated');
        const profile = await response.json();
        setUser(profile);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    fetchProfile();
  }, []);

  const login = () => {
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-url/auth/google' 
      : 'http://localhost:8000/auth/google';
    window.location.href = redirectUrl;
  };

  const logout = () => {
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-url/logout' 
      : 'http://localhost:8000/logout';
    window.location.href = redirectUrl;
  };

  return (
    <div className="login-container">
      {user ? (
        <div className="user-details">
          <Typography variant="h5" gutterBottom>
            Hello, {user.displayName}
          </Typography>
          <Button 
            variant="contained" 
            onClick={logout} 
            style={{ color: 'black' }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <ListItem button onClick={login} className="google-login-btn">
          <ListItemIcon>
            <GoogleIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Login with Google" />
        </ListItem>
      )}
    </div>
  );
};

export default Loginwithgoogle;
