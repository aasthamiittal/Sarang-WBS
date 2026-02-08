import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wbs_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const permissions = user?.permissions || {};
  const isAdmin = user?.role?.name === 'Admin';

  const hasPermission = useCallback(
    (module, action) => Boolean(permissions?.[module]?.[action]),
    [permissions]
  );

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success && data.token) {
        localStorage.setItem('wbs_token', data.token);
        localStorage.setItem('wbs_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message
        || (err.response ? `Error ${err.response.status}` : 'Cannot reach server. Is the backend running on port 5000?');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('wbs_token');
    localStorage.removeItem('wbs_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isAdmin,
        hasPermission,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
