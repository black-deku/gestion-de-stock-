import axios from 'axios';

/**
 * Pre-configured Axios instance for communicating with the Laravel API.
 *
 * - Base URL points to the Laravel dev server (port 8000).
 * - withCredentials enables Sanctum's cookie-based authentication.
 * - Default headers ensure JSON request/response.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
