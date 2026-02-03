import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from "../../services/authService.js";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'VENDOR';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: Error | null }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: Error | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      const storedUser = authService.getUser();

      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await authService.register(email, password, fullName || '');
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { error: null };
    } catch (error) {
      return { error: new Error(error as string) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { error: null };
    } catch (error) {
      return { error: new Error(error as string) };
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await authService.updateProfile(data);
      setUser(response.data.data || response.data);
      return { error: null };
    } catch (error) {
      return { error: new Error(error as string) };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      return { error: null };
    } catch (error) {
      return { error: new Error(error as string) };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data);
    } catch (error) {
      signOut();
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'ADMIN',
    isVendor: user?.role === 'VENDOR',
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};