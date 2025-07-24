import axios from 'axios';

const API = axios.create({
  baseURL: 'https://kharidomatbackend.onrender.com/api',
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
