// routes/productRoutes.js
const express = require('express');
const router = express.Router();

// Define your product routes here
router.get('/', (req, res) => {
  res.send('Product route is working');
});

module.exports = router;
