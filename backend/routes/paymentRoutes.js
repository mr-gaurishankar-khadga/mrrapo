// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();

// Define your payment routes here
router.get('/', (req, res) => {
  res.send('Payment route is working');
});

module.exports = router;
