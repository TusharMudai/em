const mongoose = require('mongoose');

const connectDB = async (mongoURI) => {
  try {
    // Use the provided MongoDB URI
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
