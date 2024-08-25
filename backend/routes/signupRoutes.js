const express = require('express');
const mongoose = require('mongoose');
const Signup = require('../models/signupModel');

const router = express.Router();

// POST endpoint to insert data
router.post('/checkout', async (req, res) => {
  const formData = req.body;
  try {
    const newSignup = new Signup(formData);
    await newSignup.save();
    res.status(200).send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

// GET endpoint to fetch all signups
router.get('/api/signups', async (req, res) => {
  try {
    const signups = await Signup.find();
    res.status(200).json(signups);
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ message: 'Failed to fetch signups.' });
  }
});

// DELETE endpoint to delete a signup by ID
router.delete('/api/signups/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Delete the user
    const result = await Signup.deleteOne({ _id: userId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

module.exports = router;
