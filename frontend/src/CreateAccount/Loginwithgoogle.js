import React, { useState, useEffect } from 'react';
import { Button, Typography, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import './Loginwithgoogle.css';

function Loginwithgoogle() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/profile')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Not authenticated');
      })
      .then((profile) => {
        setUser(profile);
        if (profile) {
          navigate('/profile');
        }
      })
      .catch(() => setUser(null));
  }, [navigate]);

  const login = () => {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/auth/google`;
  };

  const logout = () => {
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/logout`;
  };

  return (
    <div className="l">
      {user && user.displayName ? (
        <div className="user-details">
          <Typography variant="h5" gutterBottom className="greetext">
            Hello, {user.displayName}
          </Typography>
          <Button variant="contained" className="ltn" onClick={logout} style={{ color: 'black' }}>
            Logout
          </Button>
        </div>
      ) : (
        <ListItem button onClick={login} style={{ height: '100%', width: '100%' }}>
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
