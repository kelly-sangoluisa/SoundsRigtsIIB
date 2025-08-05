import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/authService';
import { LoginCredentials } from '../types';
import { useAuth } from '@/shared/hooks/useAuth';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await AuthService.login(credentials);
      
      // Usar el método del AuthProvider para guardar el token
      authLogin(response.token);
      
      // Redirigir a la página principal o a donde estaba antes
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
      
      return response;
    } catch (error: any) {
      setError(error.message || 'Error de autenticación. Verifica tus credenciales.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    clearError: () => setError('')
  };
};
