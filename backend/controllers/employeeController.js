const Employee = require('../models/Employee');

// Create a new employee
const createEmployee = async (req, res) => {
  const { name, email, position, department, salary, joiningDate } = req.body;
  const createdBy = req.user.id; // Get the user ID from the authenticated user

  try {
    const employee = new Employee({ name, email, position, department, salary, joiningDate, createdBy });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ createdBy: req.user.id });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an employee
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};