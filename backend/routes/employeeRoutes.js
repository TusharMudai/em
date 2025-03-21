const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// Routes
router.post('/', protect, createEmployee); // Create a new employee
router.get('/', protect, getAllEmployees); // Get all employees
router.get('/:id', protect, getEmployeeById); // Get a single employee by ID
router.put('/:id', protect, updateEmployee); // Update an employee
router.delete('/:id', protect, deleteEmployee); // Delete an employee

module.exports = router;