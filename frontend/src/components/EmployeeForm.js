import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { validateEmail, formatDateForInput } from '../utils/helpers';

const EmployeeForm = ({ fetchEmployees, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: 'Engineering',
    salary: '',
    joiningDate: formatDateForInput(new Date()),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const departments = [
    'Engineering',
    'Marketing',
    'HR',
    'Finance',
    'Operations'
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        if (!value) return 'Email is required';
        return validateEmail(value) ? '' : 'Invalid email format';
      case 'position':
        return value.trim() ? '' : 'Position is required';
      case 'salary':
        if (isNaN(value)) return 'Salary must be a number';
        return value > 0 ? '' : 'Salary must be positive';
      case 'joiningDate':
        if (!value) return 'Joining date is required';
        return new Date(value) > new Date() ? 'Cannot be future date' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? (value === '' ? '' : parseFloat(value)) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      await axiosInstance.post('/employees', formData);
      setSuccessMessage('Employee added successfully!');
      onSuccess?.();
      fetchEmployees?.();
      
      setFormData(prev => ({
        name: '',
        email: '',
        position: '',
        department: prev.department,
        salary: '',
        joiningDate: formatDateForInput(new Date())
      }));

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        submit: error.response?.data?.message || 
              error.response?.data?.error || 
              error.message ||
              'Failed to add employee. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
      
      {successMessage && (
        <div className="p-2 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Form fields remain the same as previous version */}
      {/* ... */}
    </form>
  );
};

export default EmployeeForm;