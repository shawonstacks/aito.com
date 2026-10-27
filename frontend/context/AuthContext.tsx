// frontend/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../services/api';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return response.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return response.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);