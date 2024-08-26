import React, { useState } from "react";
import "./Signup.css";
import Popup from "./Popup";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstname] = useState('')
  const [lastName, setLastname]= useState('');
  const [phoneNumber, setNumber]= useState('');
  const [addressLine, setaddressline]= useState('');
  const [city, setCity]= useState('');
  const [state, setState]= useState('');

  const [otp, setOtp]= useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/checkout', {
        email,
        firstName,
        password,
        lastName,
        phoneNumber,
        addressLine,
        city,
      });
      setSuccess(response.data.message);
      setIsOtpSent(true);
    }catch (error) {
      setError(error.response ? error.response.data.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };














  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
        const response = await axios.post('https://rappo.onrender.com/api/checkout', {
            email, 
            otp,
        });
        setSuccess(response.data.message);
    } catch (error) {
        setError(error.response ? error.response.data.message : 'OTP verification failed');
    } finally {
        setLoading(false);
    }
};




  return (
    <div className="checkout-container">
      <div className="form-section" style={{ display: 'flex' }}>
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
              style={{ marginRight: '30px', marginLeft: '10px' }}
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
              style={{ marginRight: '30px', marginLeft: '10px' }}
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
              <button type="submit" className="confirm-payment-btn">Verify OTP</button>
            </form>
          </Popup>
        </form>
      </div>
    </div>
  );
};

export default Signup;
