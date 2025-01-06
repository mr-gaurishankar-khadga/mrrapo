// src/components/Payment.jsx
import { useState } from 'react';
import axios from 'axios';

const Cashfree= () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create order on backend
      const { data } = await axios.post('http://localhost:5000/api/create-order', {
        amount: parseFloat(amount)
      });
      
      const { order_id, payment_session_id } = data;
      
      // Initialize Cashfree checkout
      const cashfree = new window.Cashfree({
        mode: "sandbox" // Change to "production" in live environment
      });

      cashfree.init({
        payment_session_id: payment_session_id
      });

      cashfree.redirect();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Make Payment</h2>
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount (INR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min="1"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default Cashfree;