const express = require('express');
const User = require('../models/Users');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { firstname, password } = req.body;

  try {
    const user = await User.findOne({ firstname });

    if (user && await user.matchPassword(password)) {
      const token = generateToken(user._id, user.role);
      res.json({
        token,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
