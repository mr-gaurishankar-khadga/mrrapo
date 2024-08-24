const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  title: String,
  categories: String,
  description: String,
  price: Number,
  sizes: [String],
  colors: [String],
  quantity: Number,
  discount: Number,
  frontImage: String,
  backImage: String,
  extraImage1: String,
  extraImage2: String,
});

module.exports = mongoose.model('Product', productSchema);
