import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.236.2.114:5001', // Live server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Handle errors (example)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error(`[API Error]: ${error.message}`);
    return Promise.reject(error);
  }
);

export default axiosInstance;