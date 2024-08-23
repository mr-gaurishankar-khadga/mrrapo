
import React, { useState } from 'react';
import axios from 'axios';
import './ContactPage.css';

import slider1 from './images/a1.webp';
import slider2 from './images/aa1.webp';
import slider3 from './images/aa2.webp';
import slider4 from './images/aa3.webp';
import slider5 from './images/aa4.webp';
import slider6 from './images/aa5.webp';

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:8000/api/messages', { name, email, message });
      if (response.data.success) {
        setSuccess('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
    }
  };



  return (
    <div className="contact-page">
      <div className="contact-left">
        <div className="contact-form">

          <div className="contact-info">
            <h1>Contact To Admin</h1>
            <p>Email: admin@gmail.com</p>
            <p>Phone: +9779813737842</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>

            <button type="submit">Send</button>

            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>



      <div className="contact-right">
        <div className="contact-3d">
          <div className="cube">
            <div className="face front" style={{ backgroundImage: `url(${slider1})` }}>Contact</div>
            <div className="face back" style={{ backgroundImage: `url(${slider2})` }}>Get in Touch</div>
            <div className="face right" style={{ backgroundImage: `url(${slider3})` }}>Info</div>
            <div className="face left" style={{ backgroundImage: `url(${slider4})` }}>Details</div>
            <div className="face top" style={{ backgroundImage: `url(${slider5})` }}>Support</div>
            <div className="face bottom" style={{ backgroundImage: `url(${slider6})` }}>Help</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default ContactPage;
