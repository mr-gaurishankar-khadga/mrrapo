// MobilePayment.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import './MobilePayment.css';

const stripePromise = loadStripe('your-stripe-publishable-key');

const MobilePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await fetch('https://rappo.onrender.com/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount }),
      });

      const { clientSecret, paymentId } = await response.json();

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        setMessage(`Payment failed: ${paymentResult.error.message}`);
        await updatePaymentStatus(paymentId, 'failed');
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          setMessage('Payment successful!');
          await updatePaymentStatus(paymentId, 'succeeded');
        }
      }
    } catch (error) {
      setMessage(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const updatePaymentStatus = async (paymentId, status) => {
    try {
      await fetch('https://rappo.onrender.com/update-payment-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <div className="mobile-payment-container">
      <h2 className="payment-title">Complete Your Payment</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="amount-input-container">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="amount-input"
          />
        </div>
        <div className="card-element-container">
          <CardElement className="card-element" />
        </div>
        <button
          className={`submit-button ${isProcessing ? 'processing' : ''}`}
          disabled={!stripe || isProcessing}
          type="submit"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
};






const MobilePayment = () => (
  <Elements stripe={stripePromise}>
    <MobilePaymentForm />
  </Elements>
);

export default MobilePayment;
