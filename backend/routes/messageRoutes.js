// routes/messageRoutes.js
const express = require('express');
const router = express.Router();

// Define your message routes here
router.get('/', (req, res) => {
  res.send('Message route is working');
});

module.exports = router;
