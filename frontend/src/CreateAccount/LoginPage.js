import React, { useState } from 'react';
import './LoginPage.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import { Link, useNavigate } from 'react-router-dom';



import ForgotPasswordModal from './ForgotPasswordModal';
import Logo from './images/logo.png';

const LoginPage = ({ setToken, setIsAdmin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const openModal = () => setIsModalOpen(true); 
    const closeModal = () => setIsModalOpen(false); 





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
      const response = await axios.post('https://rappo.onrender.com/login', { firstname, password });
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
        <div className="login-page">
            <form onSubmit={handleSubmit}>
            <div className="phone-frame">
                <div className="login-container">
                    <img src={Logo} alt="" className="animated-logo" />
                    <div className="information">
                        <h2 className="animated" style={{fontFamily:'Twentieth Century sans-serif'}}>Welcome to WENLI</h2>
                        <p className="subheading animated-subheading" style={{textAlignLast:'center', marginTop:'-10px', fontFamily:'Twentieth Century sans-serif'}}>Keep your data safe</p>
                    </div>

                    <div className="input-field animated-input">
                      <input type="text"
                          name="firstname"
                          value={credentials.firstname}
                          onChange={handleChange}
                          required
                          placeholder='Username'
                      />
                    </div>

                    <div className="input-field animated-input">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                        />

                        <span className="visibility-icon" onClick={togglePasswordVisibility}>
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </span>

                    </div>

                    <button className="login-button animated-button">LOGIN</button>
                    <p className="forgot-password animated-text" onClick={openModal}>Forgot password?</p> {/* Open modal on click */}
                    <p className="register animated-text">
                        Don't have an account? <Link to="/Signup">
                        Create New Account
                    </Link>
                    </p>
                </div>
            </div>
            </form>

            {/* Render the modal */}
            <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} /> 
        </div>
    );
};

export default LoginPage;
