const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/payments', paymentController.createPayment);
router.get('/payments', paymentController.getPayments);

module.exports = router;
