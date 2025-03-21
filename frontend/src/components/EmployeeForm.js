import React, { useState } from 'react';
import axios from 'axios';

const EmployeeForm = ({ fetchEmployees }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    joiningDate: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/employees', formData);
    fetchEmployees();
    setFormData({
      name: '',
      email: '',
      position: '',
      department: '',
      salary: '',
      joiningDate: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Position"
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Department"
        value={formData.department}
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Salary"
        value={formData.salary}
        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
        required
      />
      <input
        type="date"
        placeholder="Joining Date"
        value={formData.joiningDate}
        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
        required
      />
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default EmployeeForm;