// models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  product: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  price: { 
    type: Number, 
    required: true 
  },
  cardNumber: {
    type: String, // Store in encrypted format if needed
    required: function () { return this.paymentMethod === 'Card Payment'; },
  },
  expiryDate: {
    type: String,
    required: function () { return this.paymentMethod === 'Card Payment'; },
  },
  cvv: {
    type: String,
    required: function () { return this.paymentMethod === 'Card Payment'; },
  },
}, { timestamps: true }); 

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;