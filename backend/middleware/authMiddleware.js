const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in the authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user to the request object
            req.user = await User.findById(decoded.id).select('-password');

            // Proceed to the next middleware
            next();
        } catch (error) {
            console.error(`Error verifying token: ${error.message}`);
            res.status(401).json({ 
                message: 'Not authorized, token failed',
                error: error.message // Optional: Include the error message for debugging in development
            });
        }
    }

    // Handle the case where no token is provided
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
