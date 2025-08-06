'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getUserFromToken, isAuthenticated, logout as utilLogout } from '@/shared/utils/auth';
import { tokenStorage } from '@/shared/utils/tokenStorage';

interface User {
  id: number;
  email: string;
  username: string;
  name?: string;
  role?: 'artist' | 'buyer';
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
    console.log('🔄 [useAuth] Ejecutando refreshAuth...');
    const authenticated = isAuthenticated();
    console.log('🔍 [useAuth] Estado de autenticación:', { authenticated });
    
    if (authenticated) {
      const userInfo = getUserFromToken();
      console.log('👤 [useAuth] Información de usuario obtenida:', userInfo);
      setUser(userInfo);
      setIsAuthenticatedState(true);
    } else {
      console.log('❌ [useAuth] Usuario no autenticado, limpiando estado');
      setUser(null);
      setIsAuthenticatedState(false);
    }
    
    console.log('✅ [useAuth] refreshAuth completado, isLoading = false');
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('🚀 [useAuth] AuthProvider montado, ejecutando refreshAuth inicial');
    refreshAuth();
  }, []);

  const handleLogin = (token: string) => {
    console.log('🎯 [useAuth] handleLogin ejecutado con token:', { 
      hasToken: !!token,
      tokenLength: token?.length || 0 
    });
    
    tokenStorage.set(token);
    console.log('💾 [useAuth] Token guardado en storage');
    
    const userInfo = getUserFromToken(token);
    console.log('👤 [useAuth] Información de usuario extraída del token:', userInfo);
    
    setUser(userInfo);
    setIsAuthenticatedState(true);
    
    console.log('✅ [useAuth] Estado de autenticación actualizado:', {
      isAuthenticated: true,
      userId: userInfo?.id,
      username: userInfo?.username
    });
  };

  const handleLogout = () => {
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
