// UserProfile.js
import React, { useEffect, useState } from 'react';
import { Typography, Container, List, ListItem, ListItemText } from '@mui/material';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/profile', {
      credentials: 'include', // Important for session handling
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error('Fetch error:', err);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {userData ? (
        <List>
          <ListItem>
            <ListItemText primary="Display Name" secondary={userData.displayName} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={userData.email} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Google ID" secondary={userData.googleId} />
          </ListItem>
        </List>
      ) : (
        <Typography>Loading user data...</Typography>
      )}
    </Container>
  );
};

export default UserProfile;
