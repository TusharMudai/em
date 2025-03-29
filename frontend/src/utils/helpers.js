// Formatting Utilities
export const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(salary);
  };
  
  export const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  export const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Validation Utilities
  export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  export const validateEmployeeForm = (formData) => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (!formData.position?.trim()) {
      errors.position = 'Position is required';
    }
    
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    
    if (!formData.salary || Number(formData.salary) <= 0) {
      errors.salary = 'Valid salary is required';
    }
    
    if (!formData.joiningDate) {
      errors.joiningDate = 'Joining date is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // API Helpers
  export const handleApiError = (error) => {
    console.error('API Error:', error);
    return {
      message: error.response?.data?.message || 
              error.response?.data?.error || 
              'Something went wrong. Please try again.'
    };
  };
  
  // LocalStorage Helpers
  export const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const clearAuthToken = () => {
    localStorage.removeItem('token');
  };
  
  // Department Utilities
  export const getDepartmentColor = (department) => {
    const colors = {
      'Engineering': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'HR': 'bg-pink-100 text-pink-800',
      'Finance': 'bg-green-100 text-green-800',
      'Operations': 'bg-yellow-100 text-yellow-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[department] || colors.default;
  };
  
  // Pagination Helper
  export const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  };