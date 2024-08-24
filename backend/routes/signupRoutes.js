const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');

router.post('/signup', signupController.createSignup);
router.get('/signups', signupController.getSignups);
router.delete('/signups/:id', signupController.deleteSignup);

module.exports = router;
