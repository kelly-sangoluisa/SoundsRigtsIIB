'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getUserFromToken, isAuthenticated, logout } from '@/shared/utils/auth';
import { tokenStorage } from '@/shared/utils/tokenStorage';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const authenticated = isAuthenticated();
      
      if (authenticated) {
        const userInfo = getUserFromToken();
        setUser(userInfo);
        setIsAuthenticatedState(true);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = (token: string) => {
    tokenStorage.set(token);
    const userInfo = getUserFromToken(token);
    setUser(userInfo);
    setIsAuthenticatedState(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticatedState(false);
  };

  const value = {
    user,
    isAuthenticated: isAuthenticatedState,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
