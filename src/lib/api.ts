import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Create axios instance
const api = axios.create({
  baseURL: '/', // Fallback URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors (like 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Here we could implement refresh token logic if backend supports it
      // For now, just logout user
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;

