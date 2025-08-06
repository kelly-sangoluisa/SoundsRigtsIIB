import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { AuthService } from '@/features/auth/services/authService';

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
    debugger; // 🔍 Punto de debug E: Inicio del hook login
    console.log('🔍 useLogin hook - login called:', credentials);
    
    setIsLoading(true);
    setError(null);

    try {
      debugger; // 🔍 Punto de debug F: Antes de llamar AuthService
      console.log('🔍 useLogin hook - calling AuthService.login');
      
      const response = await AuthService.login(credentials);
      
      debugger; // 🔍 Punto de debug G: Respuesta de AuthService
      console.log('🔍 useLogin hook - AuthService response:', response);
      
      if (response && response.token) {
        debugger; // 🔍 Punto de debug H: Antes de authLogin
        console.log('🔍 useLogin hook - calling authLogin with token:', response.token);
        
        authLogin(response.token);
        
        debugger; // 🔍 Punto de debug I: Antes de redirigir
        console.log('🔍 useLogin hook - redirecting to dashboard');
        
        router.push('/dashboard');
      } else {
        debugger; // 🔍 Punto de debug J: Respuesta inválida
        console.log('🔍 useLogin hook - invalid response:', response);
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      debugger; // 🔍 Punto de debug K: Error en useLogin
      console.error('🔍 useLogin hook - error:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error de conexión. Intenta nuevamente.');
      }
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