import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { env } from '@/config/env';

const api = axios.create({
  baseURL: env.apiUrl() || '/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const token = state.token;
    // Don't add auth token for dentypro API calls as they might be handled differently
    if (token && !config.url?.includes('/api/dentypro')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (state.isImpersonating) {
      config.headers['X-Impersonating'] = 'true';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      toast.error('Unauthorized. Please login again.');
      await new Promise(resolve => setTimeout(resolve, 2000));
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
