import axios from 'axios';

// Prefer env-based base URL; fall back to local dev backend
const baseURL =
  import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Optionally add auth token if needed later
API.interceptors.request.use((config) => {
  const publicEndpoints = [
    '/users/register',
    '/users/login',
    '/users/verify',
    '/users/complete-registration',
    '/users/forgot-password',
    '/users/reset-password'
  ];

  const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));

  if (!isPublic) {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default API;
