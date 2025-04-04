const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, position, department, salary, joiningDate } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const createdUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      position, 
      department, 
      salary, 
      joiningDate: joiningDate ? new Date(joiningDate) : undefined 
    });

    res.status(201).json({
      _id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      token: generateToken(createdUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }); // Renamed variable
    if (existingUser && await bcrypt.compare(password, existingUser.password)) {
      res.json({
        _id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        token: generateToken(existingUser._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '30d' });
};

module.exports = { registerUser, loginUser };
