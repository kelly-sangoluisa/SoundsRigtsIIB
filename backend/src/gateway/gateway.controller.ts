import { 
  Controller, 
  All, 
  Req, 
  Res, 
  Param, 
  Get, 
  UseGuards, 
  HttpException, 
  HttpStatus,
  Logger 
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

@Controller('api')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(private readonly gatewayService: GatewayService) {}

  @Public()
  @Get('health')
  async health() {
    return this.gatewayService.getServiceHealth();
  }

  @Public()
  @Get('gateway/stats')
  async getStats() {
    return this.gatewayService.getServiceStats();
  }

  @All('auth/*')
  async authProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyToService('auth', req, res);
  }

  @UseGuards(JwtAuthGuard)
  @All('songs/*')
  async songsProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyToService('songs', req, res);
  }

  @UseGuards(JwtAuthGuard)
  @All('licenses/*')
  async licensesProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyToService('licenses', req, res);
  }

  @UseGuards(JwtAuthGuard)
  @All('chat/*')
  async chatProxy(@Req() req: Request, @Res() res: Response) {
    return this.proxyToService('chat', req, res);
  }

  @UseGuards(JwtAuthGuard)
  @All(':service/*')
  async genericProxy(
    @Param('service') service: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.proxyToService(service, req, res);
  }

  private async proxyToService(service: string, req: Request, res: Response) {
    const startTime = Date.now();
    const path = req.url.replace(`/api/${service}`, '') || '/';
    
    try {
      this.logger.debug(`Proxying ${req.method} ${req.url} to ${service}${path}`);
      
      const result = await this.gatewayService.proxyRequest(
        service,
        path,
        req.method,
        req.body,
        this.sanitizeHeaders(req.headers),
      );
      
      const duration = Date.now() - startTime;
      this.logger.debug(`Request completed in ${duration}ms`);
      
      res.json(result);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Request failed after ${duration}ms: ${error.message}`);
      
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({
          statusCode: error.getStatus(),
          message: error.message,
          timestamp: new Date().toISOString(),
          path: req.url,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          timestamp: new Date().toISOString(),
          path: req.url,
        });
      }
    }
  }

  private sanitizeHeaders(headers: any) {
    // Remover headers que pueden causar problemas en el proxy
    const sanitized = { ...headers };
    delete sanitized.host;
    delete sanitized.connection;
    delete sanitized['content-length'];
    delete sanitized['transfer-encoding'];
    
    return sanitized;
  }
}
