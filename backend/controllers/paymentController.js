const Payment = require('../models/paymentModel');

exports.createPayment = async (req, res) => {
  const { product, quantity, paymentMethod, price, cardNumber, expiryDate, cvv } = req.body;
  try {
    const newPayment = new Payment({ product, quantity, paymentMethod, price, cardNumber, expiryDate, cvv });
    await newPayment.save();
    res.status(201).json({ message: 'Payment data stored successfully', payment: newPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error storing payment data', error });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment data', error });
  }
};
