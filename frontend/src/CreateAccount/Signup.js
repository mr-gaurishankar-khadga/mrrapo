import React, { useState } from "react";
import "./Signup.css";
import Popup from "./Popup";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    addressLine1: '',
    city: '',
    state: '',
  });
  
  const [otp, setOtp] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://rappo.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Signup successful. OTP sent to your email.');
        setIsPopupOpen(true); 
      } else {
        alert('Signup failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during signup.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://rappo.onrender.com/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });
  
      if (response.ok) {
        alert('OTP verified successfully!');
        window.location.href = `/profile/${formData.email}`;
      } else {
        const data = await response.json();
        alert(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while verifying OTP.');
    }
  };

  return (
    <>
      <div className="checkout-container">
        <div className="form-section">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3 className="shippinginfo">Shipping Information</h3>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
            <div className="name-fields">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="form-input half-width"
                style={{ marginRight: '30px', marginLeft: '10px' }}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="form-input half-width"
              />
            </div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              type="text"
              name="addressLine1"
              placeholder="Enter Your Address"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              className="form-input"
            />
            <div className="location-fields">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="form-input half-width"
                style={{ marginRight: '30px', marginLeft: '10px' }}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="form-input half-width"
              />
            </div>
            <button type="submit" className="confirm-payment-btn">Sign Up</button>
            <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Enter OTP">
              <form onSubmit={handleOtpSubmit}>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                  className="form-input"
                />
                <button type="submit" className="confirm-payment-btn">Verify OTP</button>
              </form>
            </Popup>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
