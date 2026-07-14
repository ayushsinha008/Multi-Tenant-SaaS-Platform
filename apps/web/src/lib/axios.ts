import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add tenant header
api.interceptors.request.use(
  (config) => {
    const activeWorkspaceId = useAuthStore.getState().activeWorkspaceId;
    if (activeWorkspaceId) {
      config.headers['x-tenant-id'] = activeWorkspaceId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s (refresh token logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet, and it's not the login or refresh route
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/auth/login') && 
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
