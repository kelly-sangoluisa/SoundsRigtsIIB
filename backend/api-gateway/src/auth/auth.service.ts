import { Injectable } from '@nestjs/common';
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service';

@Injectable()
export class AuthService {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  private readonly authServiceUrl = `http://${process.env.AUTH_SERVICE_HOST || 'localhost'}:${process.env.AUTH_SERVICE_PORT || 3001}`;

  async login(email: string, password: string) {
    return this.circuitBreaker.execute(
      'auth-service',
      async () => {
        const response = await fetch(`${this.authServiceUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        return response.json();
      },
      async () => {
        // Fallback para login
        throw new Error('Authentication service is currently unavailable. Please try again later.');
      }
    );
  }

  async register(username: string, email: string, password: string) {
    return this.circuitBreaker.execute(
      'auth-service',
      async () => {
        const response = await fetch(`${this.authServiceUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        
        if (!response.ok) {
          throw new Error('Registration failed');
        }
        
        return response.json();
      },
      async () => {
        // Fallback para registro
        throw new Error('Authentication service is currently unavailable. Please try again later.');
      }
    );
  }

  async getProfile(userId: string) {
    return this.circuitBreaker.execute(
      'auth-service',
      async () => {
        const response = await fetch(`${this.authServiceUrl}/auth/profile/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to get profile');
        }
        
        return response.json();
      },
      async () => {
        // Fallback para perfil
        return {
          id: userId,
          username: 'Unknown User',
          email: 'unknown@example.com',
          message: 'Profile service temporarily unavailable'
        };
      }
    );
  }

  async validateToken(token: string) {
    return this.circuitBreaker.execute(
      'auth-service',
      async () => {
        const response = await fetch(`${this.authServiceUrl}/auth/validate`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!response.ok) {
          throw new Error('Token validation failed');
        }
        
        return response.json();
      },
      async () => {
        // Fallback para validación
        throw new Error('Cannot validate token - service unavailable');
      }
    );
  }
}
