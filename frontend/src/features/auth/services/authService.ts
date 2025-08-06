import { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api/v1';

class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('🌐 [AuthService] Enviando petición de login a:', `${API_BASE_URL}/auth/login`);
    console.log('📤 [AuthService] Credenciales enviadas:', { 
      email: credentials.email, 
      hasPassword: !!credentials.password 
    });
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📡 [AuthService] Respuesta HTTP recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      const data = await response.json();
      console.log('📋 [AuthService] Datos de respuesta:', {
        hasMessage: !!data.message,
        hasToken: !!data.access_token,
        hasUser: !!data.user,
        tokenLength: data.access_token?.length || 0,
        tokenSample: data.access_token?.substring(0, 50) + '...',
        fullToken: data.access_token,  // Agregar el token completo para debug
        fullData: data
      });

      if (!response.ok) {
        console.error('❌ [AuthService] Error en la respuesta:', data);
        throw new AuthError(data.error || data.message || 'Error de autenticación');
      }

      console.log('✅ [AuthService] Login exitoso, retornando data');
      // El backend devuelve la estructura directamente
      return data;
    } catch (error) {
      console.error('💥 [AuthService] Error durante login:', error);
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(error instanceof Error ? error.message : 'Error de conexión. Intenta nuevamente.');
    }
  }

  static async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AuthError(data.error || data.message || 'Error en el registro');
      }

      // El backend devuelve la estructura directamente
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
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
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

  static async getProfile(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      return await response.json();
    } catch (error) {
      throw new AuthError(error instanceof Error ? error.message : 'Error al obtener perfil');
    }
  }
}
