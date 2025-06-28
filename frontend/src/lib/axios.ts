import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const refreshAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if(error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await refreshAxiosInstance.post('/auth/refresh', null, { withCredentials: true });
        const newToken = response.data.access_token;
        useAuthStore.getState().login(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch(err) {
        console.error("Failed to refresh token:", err);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;
