require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// ======================
// Mongoose Configuration
// ======================
mongoose.set('strictQuery', true); // Suppress strictQuery warning

// ======================
// Middleware Setup
// ======================
app.use(cors({
  origin: '*' // Allow all origins (update this for production security)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============
// Routes
// ==============
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'active',
    message: 'Backend Server is Running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
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
// MongoDB Connection & Server Initialization
// ======================
const startServer = async () => {
  try {
    // Load environment variables
    const mongoURI = process.env.MONGO_URI; // MongoDB Atlas URI from secrets
    const jwtSecret = process.env.JWT_SECRET; // JWT secret from secrets
    const PORT = process.env.PORT || 5001; // Port from secrets or default to 5001

    // Validate required environment variables
    if (!mongoURI || !jwtSecret) {
      throw new Error('Missing required environment variables: MONGO_URI or JWT_SECRET');
    }

    // Connect to MongoDB Atlas
    await connectDB(mongoURI);
    console.log('✅ MongoDB connected successfully');

    // Start Express server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on:`);
      console.log(`   Local: http://localhost:${PORT}`);
      console.log(`   Network: http://${getIpAddress()}:${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Helper function to get IP address
const getIpAddress = () => {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
};

// Start the server only when not in test mode
if (require.main === module) {
  startServer();
}

module.exports = app;
