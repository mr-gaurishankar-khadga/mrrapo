// routes/profileRoutes.js
const express = require('express');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware'); // Middleware to check authentication

const router = express.Router();

// Profile Route
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

module.exports = router;
