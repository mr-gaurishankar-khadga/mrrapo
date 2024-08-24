require('dotenv').config();
const mongoose = require('mongoose');

const mongoDbUrl = process.env.MONGO_DB_CONNECTION_MY_DATABASE;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDbUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
