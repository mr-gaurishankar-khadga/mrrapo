const express = require('express');
const Message = require('../models/Message');
const transporter = require('../config/emailConfig');

const router = express.Router();

// API endpoint to handle form submission
router.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch all user messages from MongoDB
router.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

// API endpoint to handle reply email
router.post('/api/reply', async (req, res) => {
  const { email, message: replyMessage } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reply to Your Message',
    text: replyMessage,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reply sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ error: 'Failed to send reply.' });
  }
});

module.exports = router;
