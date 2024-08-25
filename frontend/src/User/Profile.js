import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Box, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import UserOrders from './UserOrders';
import UserReturns from './UserReturns';
import Likes from './Likes';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState('Dashboard');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get the logged-in user's email from local storage or a session
        const userEmail = localStorage.getItem('userEmail');
        
        // Fetch all users, or ideally, fetch just the one user based on the stored email
        const response = await fetch(`https://rappo.onrender.com/api/signups?email=${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setUser(data[0]); // Assuming the API returns an array of users
          } else {
            console.error('User not found');
          }
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUser();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'UserOrders':
        return <UserOrders />;
      case 'UserReturns':
        return <UserReturns />;
      case 'Likes':
        return <Likes />;
      default:
        return <UserOrders />;
    }
  };

  if (!user) {
    return <p>Loading...</p>; // or a loading spinner
  }

  return (
    <div className='create' style={{ marginLeft: '-20px', height: '' }}>
      <Box sx={{ display: 'flex', backgroundColor: '' }}>
        <Box sx={{ height: '150vh', width: '240px', backgroundColor: '', color: 'black', padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', position: 'fixed' }}>
          <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
            <Avatar src="" alt={user.firstName} sx={{ width: 140, height: 110 }} style={{ marginLeft: '', margin: '10px', borderRadius: '10%' }} />
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {user.firstName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {user.email}
            </Typography>
          </Box>
          <List component="nav" style={{ overflow: 'auto', height: '1000px', scrollbarWidth: 'none', marginTop: '10px', backgroundColor: '', width: '170px' }}>
            <ListItem button onClick={() => handleItemClick('UserOrders')}>
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItem>
            <ListItem button onClick={() => handleItemClick('UserReturns')}>
              <ListItemIcon>
                <AssignmentReturnIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Return" />
            </ListItem>
            <ListItem button onClick={() => handleItemClick('Likes')}>
              <ListItemIcon>
                <FavoriteBorderIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Likes" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ flex: 1, marginTop: '16px', backgroundColor: '', width: '1300px', position: 'static', height: '', marginLeft: '300px' }}>
          <div className="divider" style={{ borderTop: '1px solid #333', width: '100%', marginLeft: '-40px', marginTop: '-20px' }}></div>
          {renderContent()}
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
