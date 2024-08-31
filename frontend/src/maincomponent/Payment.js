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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [showNotification, setShowNotification] = useState(false);

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

  const handlePaymentSubmission = async () => {
    const totalPrice = product.price * quantity;
    const paymentData = {
      product,
      quantity,
      paymentMethod,
      price: totalPrice,
      cardNumber: paymentMethod === 'Card Payment' ? cardNumber : undefined,
      expiryDate: paymentMethod === 'Card Payment' ? expiryDate : undefined,
      cvv: paymentMethod === 'Card Payment' ? cvv : undefined,
      phoneNumber,
      address,
    };
  
    try {
      const response = await fetch('https://mrrapo.onrender.com/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Payment stored:', data);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      } else {
        console.error('Failed to store payment data');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };
  
  

  const isFormValid = () => {
    if (paymentMethod === 'Card Payment') {
      return (
        validateCardNumber(cardNumber) &&
        expiryDate.length === 5 &&
        cvv.length === 3 &&
        phoneNumber.length > 0 &&
        address.length > 0
      );
    }
    return paymentMethod === 'COD' && phoneNumber.length > 0 && address.length > 0;
  };

  if (!product) {
    return <p className="no-product">No product selected.</p>;
  }

  return (
    <div className="paymentcontainer">
      <div className="payment-view">
        <h1 className="page-title">Payment</h1>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Product Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>

              <td className="product-image-cell">
                <img
                  src={`https://mrrapo.onrender.com/${product.frontImage}`}
                  alt={product.title}
                  className="product-image"
                />

              </td>
              <td>{product.title}</td>
              <td>Rs.{product.price}</td>
              <td>{quantity}</td>
              <td>Rs.{product.price * quantity}</td>
              <td>Rajbiraj</td>
            </tr>
          </tbody>
        </table>

        <h3 className="payment-method-title">Select Payment Method</h3>
        <div className="payment-methods">
          <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="cod">Cash on Delivery (COD)</label>
          </div>

          <div className={`payment-option ${paymentMethod === 'Card Payment' ? 'selected' : ''}`}>
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="Card Payment"
              checked={paymentMethod === 'Card Payment'}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="card">Card Payment</label>
          </div>
        </div>

        {paymentMethod === 'Card Payment' && (
          <div className="card-details-section animate-in">
            <h3>Card Details</h3>
            <form>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="Enter your card number"
                  value={cardNumber}
                  onChange={(e) => formatCardNumber(e.target.value)}
                  required
                />
                {!validateCardNumber(cardNumber) && cardNumber.length > 0 && (
                  <span className="error-message">Invalid card number.</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => formatExpiryDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="Enter CVV"
                  value={cvv}
                  onChange={(e) => formatCvv(e.target.value)}
                  required
                />
              </div>
            </form>
          </div>
        )}

        <h3 className="contact-details-title">Contact Details</h3>
        <form className="contact-details-form">
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </form>

        {paymentMethod === 'QR Code' && (
          <div className="qr-code-section animate-in">
            <h3>Your QR Code</h3>
            <QRCode value={`Rs.${product.price * quantity}`} size={128} />
          </div>
        )}

        <div className="twobtn">
          <button className="proceed-to-cancel" onClick={() => {/* Handle cancel */}}>Cancel</button>
          <button
            className="proceed-to-payment"
            onClick={handlePaymentSubmission}
            disabled={!isFormValid()}
          >
            Proceed to Payment
          </button>
        </div>

        {showNotification && (
          <div className="notification">
            Order confirmed successfully!
            <button className="close-notification" onClick={() => setShowNotification(false)}>
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
