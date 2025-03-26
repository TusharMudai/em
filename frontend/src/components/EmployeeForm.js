import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig'; // Use your centralized axios instance

const EmployeeForm = ({ fetchEmployees, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    joiningDate: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (formData.salary <= 0) newErrors.salary = 'Salary must be positive';
    if (!formData.joiningDate) newErrors.joiningDate = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.post('/employees', formData);
      onSuccess?.(); // Optional success callback
      fetchEmployees();
      setFormData({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        joiningDate: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to add employee',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Position Field */}
      <div>
        <input
          type="text"
          placeholder="Position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className={`w-full p-2 border rounded ${errors.position ? 'border-red-500' : ''}`}
        />
        {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
      </div>

      {/* Department Field */}
      <div>
        <input
          type="text"
          placeholder="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Salary Field */}
      <div>
        <input
          type="number"
          placeholder="Salary"
          min="0"
          step="0.01"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
          className={`w-full p-2 border rounded ${errors.salary ? 'border-red-500' : ''}`}
        />
        {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
      </div>

      {/* Joining Date Field */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Joining Date</label>
        <input
          type="date"
          value={formData.joiningDate}
          onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          className={`w-full p-2 border rounded ${errors.joiningDate ? 'border-red-500' : ''}`}
        />
        {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded text-white ${
          isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Adding...' : 'Add Employee'}
      </button>

      {/* Submission Error */}
      {errors.submit && (
        <p className="text-red-500 text-center">{errors.submit}</p>
      )}
    </form>
  );
};

export default EmployeeForm;