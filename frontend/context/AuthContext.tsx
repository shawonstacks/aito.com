// frontend/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../services/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  shop?: {
    _id?: string;
    shopName?: string;
    slug?: string;
    status?: string;
  } | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, expectedRole?: string) => Promise<unknown>;
  register: (userData: unknown) => Promise<unknown>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read cached session asynchronously to avoid synchronous effect setState warnings
    const timer = setTimeout(() => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to parse cached user:', err);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string, expectedRole?: string) => {
    try {
      const response = await API.post('/auth/login', { email, password, expectedRole });
      if (response.data.success) {
        const { token, user: loggedUser } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        return response.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  const register = async (userData: unknown) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.data.success) {
        const { token, user: registeredUser } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(registeredUser));
        setUser(registeredUser);
        return response.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(err.response?.data?.message || err.message || 'Registration failed');
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