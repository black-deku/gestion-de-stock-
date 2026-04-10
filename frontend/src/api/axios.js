import axios from 'axios';

/**
 * Pre-configured Axios instance for communicating with the Laravel API.
 *
 * - Base URL points to the local Vite proxy (/api) which forwards to Laravel.
 * - withCredentials enables Sanctum's cookie-based authentication via same-origin.
 * - Default headers ensure JSON request/response.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
