import React from 'react';
import axios from 'axios';

const EmployeeList = ({ employees, fetchEmployees }) => {
  const deleteEmployee = async (id) => {
    await axios.delete(`/api/employees/${id}`);
    fetchEmployees();
  };

  return (
    <ul>
      {employees.map((employee) => (
        <li key={employee._id}>
          <div>
            <strong>{employee.name}</strong> - {employee.position} ({employee.department})
          </div>
          <button onClick={() => deleteEmployee(employee._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default EmployeeList;