import axios from 'axios';

/**
 * Pre-configured Axios instance for communicating with the Laravel API.
 *
 * - Base URL uses the Vite proxy (/api) so all requests stay same-origin (no CORS).
 * - A request interceptor attaches the Bearer token from localStorage.
 * - A response interceptor catches 401s and clears stale auth state.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 responses, clear stale token so user gets redirected to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    return Promise.reject(error);
  }
);

export default api;
