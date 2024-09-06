
import React, { useState } from 'react';
import axios from 'axios';
import './ContactPage.css';


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
    <div className="contact-page" style={{justifyContent:'center',display:'flex'}}>
      <div className="contact-left">
        <div className="contact-form">

          <div className="contact-info">
            <h1 style={{fontFamily:'Twentieth Century sans-serif'}}> Help Desk</h1>
            <p style={{marginTop:'-25px',letterSpacing:'2px'}}>Email: admin@gmail.com</p>
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
    </div>
  );
}

export default ContactPage;
