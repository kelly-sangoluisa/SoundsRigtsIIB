import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      service: 'API Gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get()
  getRoot() {
    return {
      message: 'SoundsRights API Gateway',
      version: '1.0.0',
      documentation: '/api'
    };
  }
}
