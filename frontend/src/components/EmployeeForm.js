import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { validateEmail, formatDateForInput } from '../utils/helpers'; // You'll need to create these

const EmployeeForm = ({ fetchEmployees, onSuccess }) => {
  // Initialize form data with proper types
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: 'Engineering', // Default department
    salary: '',
    joiningDate: formatDateForInput(new Date()), // Default to today
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Department options
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
        return value > 0 ? '' : 'Salary must be positive';
      case 'joiningDate':
        return value ? '' : 'Joining date is required';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value
    }));
    
    // Validate on change only if the field has been touched
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await axiosInstance.post('/employees', {
        ...formData,
        salary: parseFloat(formData.salary)
      });

      // Success handling
      setSuccessMessage('Employee added successfully!');
      onSuccess?.();
      fetchEmployees();
      
      // Reset form but keep department and date
      setFormData(prev => ({
        name: '',
        email: '',
        position: '',
        department: prev.department,
        salary: '',
        joiningDate: formatDateForInput(new Date())
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        submit: error.response?.data?.message || 
               error.response?.data?.error || 
               'Failed to add employee. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
      
      {/* Success Message */}
      {successMessage && (
        <div className="p-2 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          onBlur={(e) => setErrors(prev => ({
            ...prev,
            name: validateField('name', e.target.value)
          }))}
          className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={(e) => setErrors(prev => ({
            ...prev,
            email: validateField('email', e.target.value)
          }))}
          className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Position Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
        <input
          type="text"
          name="position"
          placeholder="Software Engineer"
          value={formData.position}
          onChange={handleChange}
          onBlur={(e) => setErrors(prev => ({
            ...prev,
            position: validateField('position', e.target.value)
          }))}
          className={`w-full p-2 border rounded ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
      </div>

      {/* Department Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Salary Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Salary ($)</label>
        <input
          type="number"
          name="salary"
          min="0"
          step="0.01"
          placeholder="50000"
          value={formData.salary}
          onChange={handleChange}
          onBlur={(e) => setErrors(prev => ({
            ...prev,
            salary: validateField('salary', e.target.value)
          }))}
          className={`w-full p-2 border rounded ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
      </div>

      {/* Joining Date Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          onBlur={(e) => setErrors(prev => ({
            ...prev,
            joiningDate: validateField('joiningDate', e.target.value)
          }))}
          className={`w-full p-2 border rounded ${errors.joiningDate ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.joiningDate && <p className="text-red-500 text-xs mt-1">{errors.joiningDate}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded text-white font-medium ${
          isSubmitting 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : 'Add Employee'}
      </button>

      {/* Submission Error */}
      {errors.submit && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-center">
          {errors.submit}
        </div>
      )}
    </form>
  );
};

export default EmployeeForm;