import { Injectable } from '@nestjs/common';

@Injectable()
export class CircuitBreakerService {
  private circuitStates = new Map<string, { 
    isOpen: boolean; 
    failureCount: number; 
    lastFailureTime: number;
    timeout: number;
  }>();

  private readonly failureThreshold = 5;
  private readonly recoveryTimeout = 30000; // 30 segundos

  async execute<T>(
    serviceId: string, 
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    const circuitState = this.circuitStates.get(serviceId) || {
      isOpen: false,
      failureCount: 0,
      lastFailureTime: 0,
      timeout: this.recoveryTimeout
    };

    // Si el circuito está abierto, verificar si se puede cerrar
    if (circuitState.isOpen) {
      const now = Date.now();
      if (now - circuitState.lastFailureTime > circuitState.timeout) {
        circuitState.isOpen = false;
        circuitState.failureCount = 0;
      } else {
        // Circuito abierto - usar fallback si está disponible
        if (fallback) {
          return await fallback();
        }
        throw new Error(`Service ${serviceId} is currently unavailable (Circuit breaker is open)`);
      }
    }

    try {
      const result = await operation();
      // Operación exitosa - resetear contador de fallos
      circuitState.failureCount = 0;
      this.circuitStates.set(serviceId, circuitState);
      return result;
    } catch (error) {
      // Operación falló - incrementar contador
      circuitState.failureCount++;
      circuitState.lastFailureTime = Date.now();
      
      // Si se supera el umbral, abrir el circuito
      if (circuitState.failureCount >= this.failureThreshold) {
        circuitState.isOpen = true;
      }
      
      this.circuitStates.set(serviceId, circuitState);

      // Usar fallback si está disponible
      if (fallback) {
        return await fallback();
      }
      
      throw error;
    }
  }

  getCircuitState(serviceId: string) {
    return this.circuitStates.get(serviceId);
  }
}
