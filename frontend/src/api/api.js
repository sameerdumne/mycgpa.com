import axios from 'axios';

// 1. Configure base API URL (adjust for your backend)
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend endpoint
  timeout: 10000, // 10s timeout
});

// 2. Request interceptor (for adding JWT token)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Response interceptor (for error handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;