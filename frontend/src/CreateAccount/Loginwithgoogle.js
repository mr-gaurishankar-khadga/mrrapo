import React, { useState, useEffect } from 'react';
import { Button, Typography, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import './Loginwithgoogle.css';

function Loginwithgoogle() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/profile');
        if (!response.ok) throw new Error('Not authenticated');
        const profile = await response.json();
        setUser(profile);
        if (profile) {
          navigate('/userprofile'); // Ensure lowercase for the route
        }
      } catch (error) {
        console.error(error); // Log error for debugging
        setUser(null);
      }
    };

    fetchProfile();
  }, [navigate]);

  const login = () => {
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://mrrapo.onrender.com/auth/google' 
      : 'http://localhost:8000/auth/google'; // Updated to match backend port
    window.location.href = redirectUrl;
  };

  const logout = () => {
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://mrrapo.onrender.com/logout' 
      : 'http://localhost:8000/logout'; // Updated to match backend port
    window.location.href = redirectUrl;
  };

  return (
    <div className="login-container">
      {user && user.displayName ? (
        <div className="user-details">
          <Typography variant="h5" gutterBottom className="greetext">
            Hello, {user.displayName}
          </Typography>
          <Button 
            variant="contained" 
            className="logout-btn" 
            onClick={logout} 
            style={{ color: 'black' }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <ListItem 
          button 
          onClick={login} 
          className="google-login-btn" 
          style={{ height: '100%', width: '100%' }}
        >
          <ListItemIcon>
            <GoogleIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Login with Google" />
        </ListItem>
      )}
    </div>
  );
}

export default Loginwithgoogle;
