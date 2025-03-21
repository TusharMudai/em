const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new employee
const registerUser = async (req, res) => {
    const { name, email, password, position, department, salary, joiningDate } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, position, department, salary, joiningDate });
        res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            position: user.position, 
            department: user.department, 
            salary: user.salary, 
            joiningDate: user.joiningDate, 
            token: generateToken(user.id) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login an employee
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                position: user.position, 
                department: user.department, 
                salary: user.salary, 
                joiningDate: user.joiningDate, 
                token: generateToken(user.id) 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get employee profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            position: user.position,
            department: user.department,
            salary: user.salary,
            joiningDate: user.joiningDate,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update employee profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, position, department, salary, joiningDate } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.position = position || user.position;
        user.department = department || user.department;
        user.salary = salary || user.salary;
        user.joiningDate = joiningDate || user.joiningDate;

        const updatedUser = await user.save();
        res.json({ 
            id: updatedUser.id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            position: updatedUser.position, 
            department: updatedUser.department, 
            salary: updatedUser.salary, 
            joiningDate: updatedUser.joiningDate, 
            token: generateToken(updatedUser.id) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };