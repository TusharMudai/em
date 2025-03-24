require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose
const connectDB = require('./config/db'); // Import the connectDB function

// Suppress Mongoose deprecation warning
mongoose.set('strictQuery', false);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // Authentication routes
app.use('/api/employees', require('./routes/employeeRoutes')); // Employee management routes

// Connect to MongoDB and start the server
if (require.main === module) {
  // Connect to MongoDB
  connectDB()
    .then(() => {
      console.log('MongoDB connected successfully');

      // Start the server
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit the process if the connection fails
    });
}

// Export the app object for testing
module.exports = app;