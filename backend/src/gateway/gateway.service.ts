import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as CircuitBreaker from 'opossum';

interface ServiceConfig {
  baseUrl: string;
  timeout: number;
}

export interface CircuitBreakerStats {
  open: boolean;
  halfOpen: boolean;
  closed: boolean;
  fallbackExecuted: number;
  requestCount: number;
  successCount: number;
  errorCount: number;
}

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);
  private readonly circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private readonly services: Record<string, ServiceConfig>;
  private readonly circuitBreakerOptions: any;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.services = this.configService.get('gateway.services') || {
      auth: { baseUrl: 'http://localhost:3000', timeout: 5000 },
      songs: { baseUrl: 'http://localhost:3000', timeout: 5000 },
      licenses: { baseUrl: 'http://localhost:3000', timeout: 5000 },
      chat: { baseUrl: 'http://localhost:3000', timeout: 5000 },
    };

    this.circuitBreakerOptions = this.configService.get('circuitBreaker') || {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
      enabled: false, // Deshabilitado por defecto en desarrollo
    };

    this.initializeCircuitBreakers();
  }

  private initializeCircuitBreakers() {
    Object.keys(this.services).forEach(serviceName => {
      const breaker = new CircuitBreaker(
        this.makeRequest.bind(this, serviceName),
        {
          timeout: this.circuitBreakerOptions.timeout,
          errorThresholdPercentage: this.circuitBreakerOptions.errorThresholdPercentage,
          resetTimeout: this.circuitBreakerOptions.resetTimeout,
          name: `${serviceName}-circuit-breaker`,
          enabled: this.circuitBreakerOptions.enabled,
        }
      );

      // Event listeners para logging
      breaker.on('open', () => {
        this.logger.warn(`Circuit breaker OPENED for ${serviceName}`);
      });

      breaker.on('halfOpen', () => {
        this.logger.log(`Circuit breaker HALF-OPEN for ${serviceName}`);
      });

      breaker.on('close', () => {
        this.logger.log(`Circuit breaker CLOSED for ${serviceName}`);
      });

      breaker.on('fallback', () => {
        this.logger.warn(`Fallback executed for ${serviceName}`);
      });

      // Fallback function
      breaker.fallback(() => {
        throw new HttpException(
          `Service ${serviceName} is currently unavailable`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      });

      this.circuitBreakers.set(serviceName, breaker);
    });
  }

  private async makeRequest(serviceName: string, path: string, method: string, data?: any, headers?: any) {
    const service = this.services[serviceName];
    if (!service) {
      throw new HttpException(`Service ${serviceName} not found`, HttpStatus.NOT_FOUND);
    }

    const url = `${service.baseUrl}${path}`;
    
    this.logger.debug(`Making request to ${serviceName}: ${method} ${url}`);

    const response = await firstValueFrom(
      this.httpService.request({
        method,
        url,
        data,
        headers: {
          ...headers,
          'User-Agent': 'API-Gateway/1.0.0',
        },
        timeout: service.timeout,
      })
    );

    return response.data;
  }

  async proxyRequest(service: string, path: string, method: string, data?: any, headers?: any) {
    try {
      const breaker = this.circuitBreakers.get(service);
      
      if (!breaker) {
        // Si no hay circuit breaker, hacer la request directamente
        return await this.makeRequest(service, path, method, data, headers);
      }

      // Usar circuit breaker
      return await breaker.fire(path, method, data, headers);
      
    } catch (error) {
      this.logger.error(`Error in ${service}${path}: ${error.message}`);
      
      if (error.response) {
        throw new HttpException(
          error.response.data,
          error.response.status,
        );
      }
      
      if (error.code === 'EOPENBREAKER') {
        throw new HttpException(
          `Service ${service} is temporarily unavailable`,
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getServiceHealth() {
    const services = Object.keys(this.services).map(serviceName => {
      const breaker = this.circuitBreakers.get(serviceName);
      const stats: CircuitBreakerStats = breaker ? {
        open: breaker.opened,
        halfOpen: breaker.halfOpen,
        closed: breaker.closed,
        fallbackExecuted: breaker.stats.fallbacks,
        requestCount: breaker.stats.fires,
        successCount: breaker.stats.successes,
        errorCount: breaker.stats.failures,
      } : {
        open: false,
        halfOpen: false,
        closed: true,
        fallbackExecuted: 0,
        requestCount: 0,
        successCount: 0,
        errorCount: 0,
      };

      return {
        name: serviceName,
        baseUrl: this.services[serviceName].baseUrl,
        circuitBreaker: stats,
      };
    });

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services,
      gateway: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    };
  }

  async getServiceStats() {
    const stats = {};
    this.circuitBreakers.forEach((breaker, serviceName) => {
      stats[serviceName] = {
        name: breaker.name,
        enabled: breaker.enabled,
        state: breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF_OPEN' : 'CLOSED',
        stats: breaker.stats,
      };
    });
    return stats;
  }
}
