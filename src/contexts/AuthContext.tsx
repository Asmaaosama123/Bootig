import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  role: 'customer' | 'vendor' | 'admin';
  storeId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ امسح الـ session دايماً عند كل تشغيل للتطبيق
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken); // <-- يتأكد من الحفظ بالاسم الصحيح
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    const role = user?.role;
    const currentPath = window.location.pathname;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    if (role === 'admin' || currentPath.startsWith('/admin')) {
      window.location.href = '/admin/login';
    } else if (role === 'vendor' || currentPath.startsWith('/my-store') || currentPath.startsWith('/vendor')) {
      window.location.href = '/vendor/login';
    } else {
      window.location.href = '/login';
    }
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};