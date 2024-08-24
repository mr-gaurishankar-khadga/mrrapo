const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const signupRoutes = require('./routes/signupRoutes');
const messageRoutes = require('./routes/messageRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_MY_DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you want to include cookies in requests
}));

// Define your API routes
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/messages', messageRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('Server is up and running');
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
