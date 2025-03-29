const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Routes with /auth prefix (matches server.js mounting)
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;