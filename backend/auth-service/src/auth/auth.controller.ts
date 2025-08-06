import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: { username: string; email: string; password: string }) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.authService.getProfile(parseInt(id));
  }

  @Post('validate')
  async validateToken(@Body() body: { token: string }) {
    return this.authService.validateToken(body.token);
  }
}
