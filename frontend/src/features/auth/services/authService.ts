import { LoginCredentials, LoginResponse } from '../types';
import { mockAuthAPI } from '@/shared/utils/mockAPI';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || true; // Usar mock por defecto

class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      debugger; // 🔍 Punto de debug 1: Inicio del login
      console.log('🔍 Login attempt:', credentials);
      console.log('🔍 USE_MOCK_API:', USE_MOCK_API);
      console.log('🔍 API_BASE_URL:', API_BASE_URL);
      
      if (USE_MOCK_API) {
        debugger; // 🔍 Punto de debug 2: Usando mock API
        console.log('🔍 Using mock API');
        // Usar API simulada
        return await mockAuthAPI.login(credentials.email, credentials.password);
      }
      
      debugger; // 🔍 Punto de debug 3: Usando API real
      console.log('🔍 Using real API');
      // API real (cuando esté disponible)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AuthError(data.message || 'Error de autenticación');
      }

      return data;
    } catch (error) {
      debugger; // 🔍 Punto de debug 4: Error capturado
      console.error('🔍 Error in login:', error);
      
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(error instanceof Error ? error.message : 'Error de conexión. Intenta nuevamente.');
    }
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      if (USE_MOCK_API) {
        // Usar validación simulada
        return await mockAuthAPI.validateToken(token);
      }
      
      // API real (cuando esté disponible)
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}