const express = require('express');
const app = express();
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const signupRoutes = require('./routes/signupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_CONNECTION_MY_DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', paymentRoutes);
app.use('/api', productRoutes);
app.use('/api', signupRoutes);
app.use('/api', messageRoutes);

module.exports = app;
