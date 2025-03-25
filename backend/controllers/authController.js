const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logError } = require('../utils/logger'); // Optional logging utility

// Token generation (extracted for reusability)
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
};

// Unified error response handler
const handleError = (res, error, context) => {
    const errorId = Date.now();
    logError(`[${errorId}] ${context}:`, error); // Implement your logging
    
    const response = {
        message: `Authentication error (Ref: ${errorId})`,
        ...(process.env.NODE_ENV === 'development' && { 
            debug: error.message,
            stack: error.stack 
        })
    };
    
    res.status(error.statusCode || 500).json(response);
};

// Registration with enhanced validation
const registerUser = async (req, res) => {
    const requiredFields = [
        'name', 'email', 'password', 
        'position', 'department', 
        'salary', 'joiningDate'
    ];
    
    try {
        // Validate all required fields
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missing: missingFields
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ 
                message: 'Invalid email format' 
            });
        }

        // Check existing user
        if (await User.findOne({ email: req.body.email })) {
            return res.status(409).json({ 
                message: 'Email already registered' 
            });
        }

        // Create and save user (password auto-hashed by model hook)
        const user = await User.create(req.body);

        // Successful response
        res.status(201).json({
            status: 'success',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                position: user.position,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        error.statusCode = 400; // Bad request for validation errors
        handleError(res, error, 'Registration');
    }
};

// Login with security enhancements
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide both email and password'
            });
        }

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid credentials' // Generic message for security
            });
        }

        // Password comparison with timing-safe check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Generate new token on each login
        const token = generateToken(user._id);

        // Secure response (exclude sensitive data)
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
        handleError(res, error, 'Login');
    }
};

// Get profile with caching headers
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v')
            .cache(process.env.CACHE_TTL || 60); // Optional caching

        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        res.set('Cache-Control', 'public, max-age=60');
        res.json({
            status: 'success',
            data: user
        });

    } catch (error) {
        handleError(res, error, 'Get Profile');
    }
};

// Update profile with change tracking
const updateUserProfile = async (req, res) => {
    try {
        const allowedUpdates = [
            'name', 'email', 'position',
            'department', 'salary', 'joiningDate'
        ];
        
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        // Special handling for password
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
            updates.passwordChangedAt = Date.now();
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        // Generate new token if email/password changed
        const newToken = (updates.email || updates.password) 
            ? generateToken(user._id)
            : undefined;

        res.json({
            status: 'success',
            data: {
                user,
                ...(newToken && { token: newToken })
            }
        });

    } catch (error) {
        handleError(res, error, 'Update Profile');
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateUserProfile
};