import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Loginwithgoogle = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      // Send the credential (tokenId) to your backend
      const res = await axios.post('https://rappo.onrender.com/api/google-login', { tokenId: credential });
      localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user data in local storage
      window.location.href = '/profile'; // Redirect to profile
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleLoginFailure = (response) => {
    console.error('Google login failed:', response);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={'single_host_origin'}
          style={{ margin: '20px' }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Loginwithgoogle;
