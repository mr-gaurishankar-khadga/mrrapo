require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB using environment variables
mongoose.connect(process.env.MONGO_DB_CONNECTION_MY_DATABASE)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Rest of your server setup
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
