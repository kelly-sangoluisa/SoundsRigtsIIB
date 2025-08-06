import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { AuthService } from '@/features/auth/services/authService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    created_at?: string;
    updated_at?: string;
  };
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    console.log('🔐 [useLogin] Iniciando proceso de login con:', { 
      email: credentials.email,
      timestamp: new Date().toISOString() 
    });
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('📡 [useLogin] Enviando petición al AuthService...');
      const response = await AuthService.login(credentials);
      console.log('📨 [useLogin] Respuesta del AuthService:', {
        hasToken: !!response.access_token,
        message: response.message,
        user: response.user
      });
      
      if (response.access_token) {
        console.log('✅ [useLogin] Token recibido, ejecutando authLogin...');
        authLogin(response.access_token);
        
        // Extraer información del usuario para determinar la redirección
        console.log('🔍 [useLogin] Analizando usuario para redirección:', response.user);
        
        // Por ahora redirigir a dashboard genérico
        console.log('🚀 [useLogin] Redirigiendo a dashboard...');
        
        try {
          router.push('/dashboard');
          console.log('✅ [useLogin] router.push("/dashboard") ejecutado');
        } catch (routerError) {
          console.error('❌ [useLogin] Error con router.push, intentando window.location:', routerError);
          window.location.href = '/dashboard';
        }
        
        // Verificar después de un momento si la redirección fue exitosa
        setTimeout(() => {
          console.log('🔄 [useLogin] Verificando estado después de redirección:', {
            currentPath: window.location.pathname,
            shouldBeDashboard: window.location.pathname === '/dashboard'
          });
        }, 1000);
      } else {
        console.warn('❌ [useLogin] No se recibió token de acceso:', response);
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('💥 [useLogin] Error durante el login:', err);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      console.log('🏁 [useLogin] Finalizando proceso de login');
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error
  };
};
