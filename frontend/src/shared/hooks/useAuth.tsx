'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getUserFromToken, isAuthenticated, logout as utilLogout } from '@/shared/utils/auth';
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
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = () => {
    debugger; // 🔍 Punto de debug L: refreshAuth llamado
    console.log('🔍 AuthProvider - refreshAuth called');
    
    const authenticated = isAuthenticated();
    console.log('🔍 AuthProvider - isAuthenticated result:', authenticated);
    
    if (authenticated) {
      debugger; // 🔍 Punto de debug M: Usuario autenticado
      const userInfo = getUserFromToken();
      console.log('🔍 AuthProvider - user info from token:', userInfo);
      setUser(userInfo);
      setIsAuthenticatedState(true);
    } else {
      debugger; // 🔍 Punto de debug N: Usuario no autenticado
      console.log('🔍 AuthProvider - user not authenticated');
      setUser(null);
      setIsAuthenticatedState(false);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const handleLogin = (token: string) => {
    debugger; // 🔍 Punto de debug O: handleLogin llamado
    console.log('🔍 AuthProvider - handleLogin called with token:', token);
    
    tokenStorage.set(token);
    const userInfo = getUserFromToken(token);
    
    debugger; // 🔍 Punto de debug P: Usuario obtenido del token
    console.log('🔍 AuthProvider - user info from login token:', userInfo);
    
    setUser(userInfo);
    setIsAuthenticatedState(true);
  };

  const handleLogout = () => {
    debugger; // 🔍 Punto de debug Q: handleLogout llamado
    console.log('🔍 AuthProvider - handleLogout called');
    
    utilLogout();
    setUser(null);
    setIsAuthenticatedState(false);
  };

  const value = {
    user,
    isAuthenticated: isAuthenticatedState,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook useAuth()
 * 
 * Devuelve el estado de autenticación del usuario actual
 * Permite hacer logout limpiando el JWT
 * 
 * @returns {Object} Estado de autenticación
 * @returns {User | null} user - Usuario autenticado o null
 * @returns {boolean} isAuthenticated - Si el usuario está autenticado
 * @returns {boolean} isLoading - Si está cargando el estado de autenticación
 * @returns {Function} login - Función para hacer login con un token
 * @returns {Function} logout - Función para hacer logout y limpiar JWT
 * @returns {Function} refreshAuth - Función para refrescar el estado de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
