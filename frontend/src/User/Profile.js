

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { Box, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import UserOrders from './UserOrders';
import UserReturns from './UserReturns';
import Likes from './Likes';
import ShoppingCartView from '../maincomponent/ShoppingCartView'

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
      const [selectedItem, setSelectedItem] = useState('Dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found. Please login again.');
                navigate('/signup'); // Redirect to signup if token is not found
                return;
            }

            try {
                const response = await axios.get('https://rappo.onrender.com/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data.user);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                alert('Failed to fetch user data. Please login again.');
                navigate('/signup');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);


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

      case 'ShoppingCartView':
        return <ShoppingCartView />;
      default:
        return <UserOrders />;
    }
  };

    if (loading) return <div>Loading...</div>;












  return (
    <div className='create' style={{ marginLeft: '-20px', height: '' }}>
        {
            userData ? (
            <Box sx={{ display: 'flex', backgroundColor: '' }}>
        <Box sx={{ height: '150vh', width: '240px', backgroundColor: '', color: 'black', padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', position: 'fixed' }}>
          <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
            <Avatar src="" alt={userData.firstName} sx={{ width: 140, height: 110 }} style={{ marginLeft: '', margin: '10px', borderRadius: '10%' }} />
            <Typography variant="body2" sx={{ color: 'white' }}>
              {userData.firstName}
            </Typography>
            {/* <Typography variant="body2" sx={{ color: 'white' }}>
              {userData.email}
            </Typography> */}

            <Typography variant="body2" sx={{ color: 'white' }}>
              {userData.addressLine}, {userData.city}, {userData.state}
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

            <ListItem button onClick={() => handleItemClick('ShoppingCartView')}>
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ flex: 1, marginTop: '16px', backgroundColor: '', width: '1300px', position: 'static', height: '', marginLeft: '300px' }}>
          <div className="divider" style={{ borderTop: '1px solid #333', width: '100%', marginLeft: '-40px', marginTop: '-20px' }}></div>
          {renderContent()}
        </Box>
      </Box>
            ):(
            <p>No user data found.</p>
        )};

    </div>
  );
};

export default Profile;

        // <div className="profile-container">
        //     <h1>User Profile</h1>
        //     {userData ? (
            //         <div className="profile-info">
            //             <p><strong>First Name:</strong> {userData.firstName}</p>
            //             <p><strong>Last Name:</strong> {userData.lastName}</p>
            //             <p><strong>Email:</strong> {userData.email}</p>
            //             <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
            //             <p><strong>Address:</strong> {userData.addressLine}, {userData.city}, {userData.state}</p>
            //         </div>
            //     ) : (
        //         <p>No user data found.</p>
        //     )}
        // </div>