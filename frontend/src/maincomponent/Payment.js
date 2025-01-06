import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const { product, quantity } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const formatCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = numericValue.replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    setCardNumber(formattedValue);
  };

  const formatExpiryDate = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = numericValue.replace(/(\d{2})(\d{0,2})/, '$1/$2').slice(0, 5);
    setExpiryDate(formattedValue);
  };

  const formatCvv = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 3);
    setCvv(numericValue);
  };

  const validateCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const isValid = (num) => {
      let sum = 0;
      let alternate = false;
      for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num.charAt(i), 10);
        if (alternate) {
          n *= 2;
          if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
      }
      return sum % 10 === 0;
    };
    return numericValue.length === 16 && isValid(numericValue);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setEmailError('');
      return true;
    } else {
      setEmailError('Invalid email address');
      return false;
    }
  };

  const fetchHumanReadableAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Unable to fetch address.';
    }
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await fetchHumanReadableAddress(latitude, longitude);
          setAddress(address);
          setUserLocation(`Lat: ${latitude}, Long: ${longitude}`);
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Unable to fetch location. Please enter your address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendEmail = async (email, message) => {
    try {
      const response = await fetch('http://localhost:8000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send verification email. Please try again.');
    }
  };

  const handleSendOtp = async () => {
    if (!validateEmail(email)) return;

    const otp = generateOtp();
    setGeneratedOtp(otp);
    const otpMessage = `Your OTP for payment verification is: ${otp}`;
    
    await sendEmail(email, otpMessage);
    setOtpSent(true);
    alert('OTP sent to your email address.');
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handlePaymentSubmission = async () => {
    if (!address || !email) {
      alert('Please enter both address and email.');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!otpVerified) {
      alert('Please verify your email OTP before proceeding with payment.');
      return;
    }

    const totalPrice = product.price * quantity;
    const paymentData = {
      product,
      quantity,
      paymentMethod,
      price: totalPrice,
      address,
      email,
      cardNumber: paymentMethod === 'Card Payment' ? cardNumber : undefined,
      expiryDate: paymentMethod === 'Card Payment' ? expiryDate : undefined,
      cvv: paymentMethod === 'Card Payment' ? cvv : undefined,
    };

    try {
      const response = await fetch('http://localhost:8000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Payment stored:', data);

        const emailMessage = `Payment successful for ${product.title}. Amount: Rs.${totalPrice}.`;
        await sendEmail(email, emailMessage);

        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      } else {
        throw new Error('Failed to store payment data');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  if (!product) {
    return <p className="no-product">No product selected.</p>;
  }

  return (
    <div className="mainpaymentcontainer" style={{display:'flex',justifyContent:'center'}}>
      <div className="payment-container">
        <div className="payment-view">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="product-image-cell">
                  <img
                    src={`http://localhost:8000/${product.frontImage}`}
                    alt={product.title}
                    className="product-image-all"
                  />
                </td>
                <td>{product.title}</td>
                <td>Rs.{product.price}</td>
                <td>{quantity}</td>
                <td>Rs.{product.price * quantity}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="payment-method-title">Select Payment Method</h3>
          <div className="payment-methods">
            <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="cod"
                name="payment-method"
                value="COD"
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="cod" style={{fontSize:'15px'}}>COD</label>
            </div>
            <div className={`payment-option ${paymentMethod === 'Card Payment' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="card"
                name="payment-method"
                value="Card Payment"
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="card" style={{fontSize:'15px'}}>Card</label>
            </div>
            <div className={`payment-option ${paymentMethod === 'UPI Payment' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="upi"
                name="payment-method"
                value="UPI Payment"
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="upi" style={{fontSize:'15px'}}>UPI</label>
            </div>
          </div>

          {paymentMethod === 'Card Payment' && (
            <div className="card-details">
              <h3 className="card-details-title">Enter Card Details</h3>
              <div className="card-details-row">
                <label>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => formatCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                />
                {!validateCardNumber(cardNumber) && (
                  <span className="error">Invalid card number</span>
                )}
              </div>
              <div className="card-details-row">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => formatExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                />
              </div>
              <div className="card-details-row">
                <label>CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => formatCvv(e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'UPI Payment' && (
            <div className="upi-details">
              <h3 className="upi-details-title">Scan the QR Code</h3>
              <QRCode value="upi://pay?pa=your-vpa@upi&pn=Your Name&am=10.00&cu=INR" style={{margin:'20px'}}/>
            </div>
          )}

          <label>Address:</label>
          <div className="address-container" style={{display:'flex',height:'auto'}}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="address-of-user"
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'40%'}}
              required
            />
            <button 
              type="button" 
              className="location-btn" 
              onClick={fetchCurrentLocation}
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'40%'}}
            >
              Current Location
            </button>
          </div>

          <label>Email:</label>
          <div className="email-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="address-of-user"
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'40%'}}
              required
            />
            <button 
              type="button"
              onClick={handleSendOtp}
              style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'40%'}}
            >
              Send OTP
            </button>
          </div>
          {emailError && <span className="error">{emailError}</span>}

          {otpSent && !otpVerified && (
            <>
              <label>Enter OTP:</label>
              <div className="otp-popup" style={{display:'flex',justifyContent:'center'}}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'40%'}}
                />
                <button 
                  type="button"
                  onClick={handleVerifyOtp}
                  style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'40%'}}
                >
                  Verify OTP
                </button>
              </div>
            </>
          )}

          <button 
            className="submit-payment-btn"
            onClick={handlePaymentSubmission}
            style={{padding:'10px',margin:'10px',letterSpacing:'3px',width:'87%',marginTop:'20px',justifyContent:'center'}}
          >
            Submit Payment
          </button>

          {showNotification && (
            <div className="notification-popup">
              Payment successful and confirmation email sent!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;