import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state on mount by reading token from localStorage
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        // No token stored — user is not logged in
        setLoading(false);
        return;
      }

      try {
        // Validate the stored token by hitting the /user endpoint
        const response = await api.get('/user');
        setUser(response.data);
      } catch (error) {
        // Token is invalid or expired — clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });

    // Store the Bearer token so it persists across page reloads
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('auth_user', JSON.stringify(response.data.user));

    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
