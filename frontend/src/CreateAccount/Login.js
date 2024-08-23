

import React, { useState } from 'react';
import axios from 'axios';

import {jwtDecode} from 'jwt-decode'; 
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setToken, setIsAdmin }) => {
  const [credentials, setCredentials] = useState({ firstname: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { firstname, password } = credentials;

      // Admin access check
      if (firstname === 'admin' && password === '1234') {
        setIsAdmin(true);
        navigate('/Setup');
        return;
      }

      // Authenticate with backend
      const response = await axios.post('http://localhost:8000/login', { firstname, password });
      const { token } = response.data;

      // Decode the token
      const decodedToken = jwtDecode(token);

      setToken(token);
      setIsAdmin(decodedToken.role === 'admin');

      // Navigate based on role
      if (decodedToken.role === 'admin') {
        navigate('/Setup');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="Loginform">
      <form onSubmit={handleSubmit} className='loginform'>
        <div className="form-group">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            name="firstname"
            value={credentials.firstname}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="form-button">Login</button>
        <div className="signup">
          <button type="button" className="signup-button">
            <Link to="/Checkout" style={{ color: 'inherit', textDecoration: 'none' }}>
              Create New Account
            </Link>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
