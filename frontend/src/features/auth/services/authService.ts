import { LoginCredentials, LoginResponse } from '../types';
import { mockAuthAPI } from '@/shared/utils/mockAPI';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
      if (USE_MOCK_API) {
        // Usar API simulada
        return await mockAuthAPI.login(credentials.email, credentials.password);
      }
      
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
    } catch {
      return false;
    }
  }
}
