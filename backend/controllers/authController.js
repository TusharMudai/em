const mongoose = require('mongoose'); // Add this at top
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// MODIFIED: Get db collection directly (temporary fix)
const getUsersCollection = () => {
    return mongoose.connection.db.collection('employeedb');
};

// ... [keep all your existing helper functions] ...

// MODIFIED registerUser
const registerUser = async (req, res) => {
    try {
        const { name, email, password, position, department, salary, joiningDate } = req.body;
        
        // Check existing user
        if (await getUsersCollection().findOne({ email })) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert directly into collection
        const result = await getUsersCollection().insertOne({
            name,
            email,
            password: hashedPassword,
            position,
            department,
            salary,
            joiningDate: new Date(joiningDate)
        });

        res.status(201).json({
            status: 'success',
            data: {
                id: result.insertedId,
                name,
                email,
                position
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

// MODIFIED loginUser
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await getUsersCollection().findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            status: 'success',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

// ... [keep other functions as is, or modify similarly] ...

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateUserProfile
};