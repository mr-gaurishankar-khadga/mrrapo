// routes/signupRoutes.js
const express = require('express');
const router = express.Router();

// Define your signup routes here
router.get('/', (req, res) => {
  res.send('Signup route is working');
});

module.exports = router;
