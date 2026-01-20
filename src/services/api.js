import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Update this based on backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401, clear token and redirect to login (optional: can be handled in AuthContext)
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Valid simple redirect if not using router context here
    }
    return Promise.reject(error);
  },
);

export default api;
