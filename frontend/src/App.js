import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const response = await axios.get('/api/employees');
    setEmployees(response.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="App">
      <h1>Employee Management System</h1>
      <EmployeeForm fetchEmployees={fetchEmployees} />
      <EmployeeList employees={employees} fetchEmployees={fetchEmployees} />
    </div>
  );
}

export default App;