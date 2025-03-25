const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Get the employees collection
const getEmployeesCollection = () => mongoose.connection.db.collection('employeedb');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const employee = await getEmployeesCollection().findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: employee._id },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '30d' }
        );

        // Return response
        res.json({
            id: employee._id,
            name: employee.name,
            email: employee.email,
            position: employee.position,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, position, department, salary, joiningDate } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const existingUser = await getEmployeesCollection().findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newEmployee = {
            name,
            email,
            password: hashedPassword,
            position,
            department,
            salary,
            joiningDate: new Date(joiningDate)
        };

        // Insert into database
        const result = await getEmployeesCollection().insertOne(newEmployee);

        res.status(201).json({
            id: result.insertedId,
            name,
            email,
            position
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

module.exports = { loginUser, registerUser };