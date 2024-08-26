import React, { useState } from "react";
import "./Signup.css";
import Popup from "./Popup";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Signup = () => {
  const navigate = useNavigate(); // Initialize navigate for redirection
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
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // State for OTP verification

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
      const response = await fetch('https://rappo.onrender.com/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Checkout data submitted successfully');
        setIsPopupOpen(true); // Open the OTP popup
      } else {
        alert('Failed to submit checkout data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting checkout data');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    // Add logic to verify OTP here
    const isVerified = await verifyOtp(otp); // Function to verify OTP

    if (isVerified) {
      setIsOtpVerified(true);
      alert('OTP verified successfully!');

      // Now submit the data to your database
      try {
        const response = await fetch('https://rappo.onrender.com/storeData', { // Change to your data storage endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Data stored successfully');
          // Redirect to Profile page after successful signup
          navigate('/profile'); // Use navigate for redirection
        } else {
          alert('Failed to store data');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while storing data');
      }
    } else {
      alert('Invalid OTP. Please try again.');
    }

    setIsPopupOpen(false); // Close the popup after submitting OTP
  };

  const verifyOtp = async (otp) => {
    // Call your OTP verification endpoint
    const response = await fetch('https://rappo.onrender.com/verifyOtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });
    return response.ok; // Return true if verified, false otherwise
  };

  return (
    <>
      <div className="checkout-container">
        <div className="form-section" style={{ display: 'flex' }}>
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
            <button type="submit" className="confirm-payment-btn">Send</button>
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
