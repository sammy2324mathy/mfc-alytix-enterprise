import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config/api';

// Simple global logger for professional monitoring
const logger = {
  info: (msg: string, data?: any) => console.log(`[API INFO] ${msg}`, data || ''),
  error: (msg: string, err?: any) => console.error(`[API ERROR] ${msg}`, err || ''),
};

const API_URL = API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach the access token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
}, (error) => {
  logger.error('Request error', error);
  return Promise.reject(error);
});

// Prevent multiple concurrent refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token refresh and structured error logging
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    // Rate limit handling
    if (status === 429) {
      logger.error('Rate limit exceeded', { url: originalRequest?.url, detail });
      return Promise.reject(error);
    }

    // Server errors — log but don't expose internals
    if (status && status >= 500) {
      logger.error(`Server error ${status}`, {
        url: originalRequest?.url,
        detail: detail || 'An unexpected server error occurred',
      });
      return Promise.reject(error);
    }

    // If error is 401 and we haven't already retried
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      const { refreshToken, setTokens, logout } = useAuthStore.getState();
      
      if (!refreshToken) {
        processQueue(new Error('No refresh token available'));
        logout();
        isRefreshing = false;
        return Promise.reject(error);
      }
      
      try {
        // Call the refresh endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const { access_token, refresh_token: new_refresh_token } = response.data;
        
        // Update store with new tokens
        setTokens(access_token, new_refresh_token);
        
        // Update the failed request header and retry
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        processQueue(null, access_token);
        isRefreshing = false;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed or expired
        processQueue(refreshError, null);
        logout();
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    // Validation errors (422) — log detail for debugging
    if (status === 422 && detail) {
      logger.error('Validation error', { url: originalRequest?.url, detail });
    }
    
    return Promise.reject(error);
  }
);
