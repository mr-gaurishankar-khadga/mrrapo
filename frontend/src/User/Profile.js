import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Box, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import UserOrders from './UserOrders';
import UserReturns from './UserReturns';
import Likes from './Likes';
import axios from 'axios';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState('UserOrders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        });
        setUser(response.data); 
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false); 
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

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>{error}</div>; 

  return (
    <div className='create' style={{ marginLeft: '-20px', height: '' }}>
      <Box sx={{ display: 'flex', backgroundColor: '' }}>
        <Box sx={{ height: '150vh', width: '240px', backgroundColor: '', color: 'black', padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', position: 'fixed' }}>
          <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
            <Avatar src="" alt={user.firstname} sx={{ width: 140, height: 110 }} style={{ margin: '10px', borderRadius: '10%' }} />
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {user.firstname}
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

        <Box sx={{ flex: 1, marginTop: '16px', width: '1300px', position: 'static', height: '', marginLeft: '300px' }}>
          <div className="divider" style={{ borderTop: '1px solid #333', width: '100%', marginLeft: '-40px', marginTop: '-20px' }}></div>
          {renderContent()} 
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
