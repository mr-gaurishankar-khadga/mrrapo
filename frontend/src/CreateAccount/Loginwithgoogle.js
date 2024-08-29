import React, { useState, useEffect } from 'react';
import { Button, Typography, ListItem, ListItemIcon,ListItemText } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import './Loginwithgoogle.css';
import Profile from '../User/Profile';

function Loginwithgoogle() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/UserProfile')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Not authenticated');
      })
      .then((profile) => {
        setUser(profile);
        if (profile) {
          navigate('/UserProfile');
        }
      })
      .catch(() => setUser(null));
  }, [navigate]);

  const login = () => {
    window.location.href = process.env.NODE_ENV === 'production' 
      ? 'https://mrrapo.onrender.com/auth/google' 
      : 'http://localhost:3000';
  };

  const logout = () => {
    window.location.href = process.env.NODE_ENV === 'production' 
      ? 'https://mrrapo.onrender.com/logout' 
      : 'http://localhost:3000';
  };

  return (
    <>
    <div className="l">
        {user && user.displayName ? (
          <div className="user-details">
            <Typography variant="h5" gutterBottom className="greetext">
              Hello, {user.displayName}
              <Profile/>
              gshankar
            </Typography>

            <Button variant="contained" className="ltn" onClick={logout} style={{ color: 'black' }}>
              Logout
            </Button>
          
          </div>


        ) : (
          <>

          {/* <button  variant="contained"  className="google-login-btn"  startIcon={<GoogleIcon />}  onClick={login} style={{ paddingLeft: '100px', paddingRight: '100px', paddingTop: '15px', paddingBlock: '15px', borderRadius: '100px' }} >   Login with Google </button> */}

            <ListItem button onClick={login} className=''style={{height:'100%',width:'100%'}}>
              <ListItemIcon>
                <GoogleIcon style={{color:'white'}}/>
              </ListItemIcon>
              <ListItemText primary=" Login with Google"/>
            </ListItem>
            </>
        )}
    </div>
    </>
  );

}

export default Loginwithgoogle;
