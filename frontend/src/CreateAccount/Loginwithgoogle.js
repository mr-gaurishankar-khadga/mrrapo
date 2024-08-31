import React, { useState, useEffect } from 'react';
import { Button, Typography, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import './Loginwithgoogle.css'; 

const Loginwithgoogle = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/profile', {
          credentials: 'include',
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
      ? 'https://mrrapo.onrender.com/auth/google' 
      : 'http://localhost:8000/auth/google';
    window.location.href = redirectUrl;
  };

  const logout = () => {
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://mrrapo.onrender.com/logout' 
      : 'http://localhost:8000/logout';
    window.location.href = redirectUrl;
  };

  return (
    <div className="login-container">
      {user ? (
        <div className="user-details">
          <Typography variant="h2" gutterBottom>
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
        <div className="google-login-btn" onClick={login} style={{marginTop:'-10px'}}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon style={{ color: 'rgb(112,112,112)' }} />}
            className="google-button"
          >
            Login with Google
          </Button>
        </div>
      )}
    </div>
  );
};

export default Loginwithgoogle;
