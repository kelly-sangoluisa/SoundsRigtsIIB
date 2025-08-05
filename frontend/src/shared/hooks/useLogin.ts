import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { api } from '@/shared/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        authLogin(response.data.token);
        router.push('/dashboard');
      } else {
        setError(response.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error
  };
};
