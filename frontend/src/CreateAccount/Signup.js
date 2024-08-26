import React, { useState } from "react";
import "./Signup.css";
import Popup from "./Popup";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [phoneNumber, setNumber] = useState('');
  const [addressLine, setaddressline] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [otp, setOtp] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://rappo.onrender.com/api/signup', {
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
        addressLine,
        city,
        state,
      });
      setSuccess(response.data.message);
      setIsPopupOpen(true);
    } catch (error) {
      alert('Signup failed: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://rappo.onrender.com/api/verify-otp', { email, otp });
      alert(response.data.message);

      // Fetch user data after successful OTP verification
      await fetchUserData();

      // Navigate to the Profile page on successful OTP verification
      navigate('/Profile');
    } catch (error) {
      alert('OTP verification failed: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://rappo.onrender.com/api/profile/${email}`);
      console.log("Fetched User Data:", response.data);
      // Here you can set the user data to state or context if needed
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="checkout-container">
      <div className="form-section">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3 className="shippinginfo">Shipping Information</h3>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
          <div className="name-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="form-input half-width"
              style={{ marginRight: '10px' }}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="form-input half-width"
            />
          </div>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setNumber(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="text"
            name="addressLine"
            placeholder="Enter Your Address"
            value={addressLine}
            onChange={(e) => setaddressline(e.target.value)}
            required
            className="form-input"
          />
          <div className="location-fields">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="form-input half-width"
              style={{ marginRight: '10px' }}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="form-input half-width"
            />
          </div>
          <button type="submit" className="confirm-payment-btn" disabled={loading}>
            {loading ? 'Signing Up...' : 'Signup'}
          </button>
        </form>
      </div>

      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Enter OTP">
        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            name="otp"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="form-input"
          />
          <button type="submit" className="confirm-payment-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </Popup>
    </div>
  );
};

export default Signup;
