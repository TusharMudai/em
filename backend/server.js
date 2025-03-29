require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// ======================
// Mongoose Configuration
// ======================
mongoose.set('strictQuery', true);

// ======================
// Middleware Setup
// ======================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============
// Health Check
// ==============
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'active',
    message: 'Backend Server is Running!',
    timestamp: new Date().toISOString()
  });
});

// ==============
// API Routes
// ==============
// Auth routes - now at root level
app.use('/auth', require('./routes/authRoutes')); // Changed from /api/auth
app.use('/api/employees', require('./routes/employeeRoutes'));

// ======================
// Error Handling
// ======================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    attemptedPath: req.path 
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// ======================
// Server Initialization
// ======================
const startServer = async () => {
  try {
    const { MONGO_URI, JWT_SECRET, PORT = 5001 } = process.env;

    if (!MONGO_URI || !JWT_SECRET) {
      throw new Error('Missing required environment variables');
    }

    await connectDB(MONGO_URI);
    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;