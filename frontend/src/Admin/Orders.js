// Orders.js
import React, { useEffect, useState } from 'react';
import './Orders.css'; // Optional: Create a CSS file for styles

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://rappo.onrender.com/api/payments');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        console.log(data); // Log the response to see the structure
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date'; // Handle empty or undefined dateString
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString(); // Use getTime() for date validation
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="orders-container">
      <h1>Order List</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Product Title</th>
            <th>Quantity</th>
            <th>Payment Method</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.product.title}</td>
              <td>{order.quantity}</td>
              <td>{order.paymentMethod}</td>
              <td>Rs. {order.price}</td>
              <td>{formatDate(order.createdAt)}</td> {/* Ensure you're accessing the correct date field */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
