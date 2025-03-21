const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // Authentication routes
app.use('/api/employees', require('./routes/employeeRoutes')); // Employee management routes

// Export the app object for testing
if (require.main === module) {
  // Connect to MongoDB
  connectDB();

  // Start the server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;