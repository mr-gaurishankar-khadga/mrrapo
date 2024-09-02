import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './Payment.css';

const ONE_SIGNAL_APP_ID = '8c3f4ec5-0843-49be-b655-e2cee1b396fb';
const ONE_SIGNAL_REST_API_ID = 'ZGRiZWUzZTQtNDNkOS00Njk4LTk5ZDktYzI5ZGQzNTljYTc3';

const Payment = () => {
  const location = useLocation();
  const { product, quantity } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
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

  const validateMobileNumber = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length === 10 && /^[789]\d{9}$/.test(numericValue)) {
      setMobileNumberError('');
      return true;
    } else {
      setMobileNumberError('Invalid mobile number');
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

  const sendSMS = async (mobileNumber, message) => {
    try {
      const response = await fetch('http://localhost:8000/api/send-otp-to-user', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${ONE_SIGNAL_REST_API_ID}:`)}` 
        },
        body: JSON.stringify({ mobileNumber, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  const handleSendOtp = async () => {
    if (!validateMobileNumber(mobileNumber)) return;

    const otp = generateOtp();
    setGeneratedOtp(otp); 
    const otpMessage = `Your OTP for payment verification is: ${otp}`;
    
    await sendSMS(mobileNumber, otpMessage);
    setOtpSent(true);
    alert('OTP sent to your mobile number.');
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
    if (!address || !mobileNumber) {
      alert('Please enter both address and mobile number.');
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      alert('Please enter a valid mobile number.');
      return;
    }
    
    if (!otpVerified) {
      alert('Please verify your OTP before proceeding with payment.');
      return;
    }

    const totalPrice = product.price * quantity;
    const paymentData = {
      product,
      quantity,
      paymentMethod,
      price: totalPrice,
      address,
      mobileNumber,
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

        const smsMessage = `Payment successful for ${product.title}. Amount: Rs.${totalPrice}.`;
        await sendSMS(mobileNumber, smsMessage);

        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      } else {
        throw new Error('Failed to store payment data');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
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
            <tr style={{backgroundColor:''}}>
              <th>Product</th>
              <th>Product Title</th>
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
            style={{padding:'10px',margin:'10px',borderRadius:''}}
            required
          />

          <button type="button" className="location-btn" onClick={fetchCurrentLocation}
          style={{padding:'10px',margin:'10px'}}
          >
            Current Location
          </button>

        </div>
        <br />

        <label>Mobile Number:</label>
        <div className="mobile-number-container">
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            onBlur={() => validateMobileNumber(mobileNumber)}
            placeholder="Enter your mobile number"
            className="address-of-user"
            style={{padding:'10px',margin:'10px'}}
            required
          />
          <button type="button" onClick={handleSendOtp}
           style={{padding:'10px 30px 10px 25px',margin:'10px'}}
          >
            Send OTP
          </button>
        </div>

        {otpSent && !otpVerified && (
          <>
            <label> Enter OTP: </label>
            <div className="otp-popup" >
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{padding:'10px',margin:'10px'}}
                />
              <button type="button" onClick={handleVerifyOtp}
               style={{padding:'10px',margin:'10px'}}
              >
                Verify OTP
              </button>
            </div>
            </>
          )}
          

        <button className="submit-payment-btn" onClick={handlePaymentSubmission}
        style={{padding:'15px 50px 10px 50px',margin:'10px',borderRadius:'10px',width:'94%'}}
        >
          Submit Payment
        </button>

        {showNotification && (
          <div className="notification-popup">
            Payment successful and SMS sent to your mobile number!
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Payment;
