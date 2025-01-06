// models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
  paymentMethod: String,
  price: Number,
  cardNumber: String,
  expiryDate: String,
  mobileNumber: String,
  address: String,
  cvv: String,
});

module.exports = mongoose.model('Payment', paymentSchema);