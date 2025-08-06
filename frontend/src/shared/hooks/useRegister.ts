import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { AuthService } from '@/features/auth/services/authService';

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.register(credentials);
      
      if (response.access_token) {
        // Registrar exitoso, loguear automáticamente
        authLogin(response.access_token);
        router.push('/dashboard');
      } else {
        setError(response.message || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
