import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await this.usersService.validatePassword(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = { email: user.email, sub: user._id, firstName: user.firstName };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const user = await this.usersService.create(createUserDto);
    const userObj = user.toObject();
    const { password, ...result } = userObj;
    
    const payload = { email: result.email, sub: result._id, firstName: result.firstName };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: result._id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
      },
    };
  }
}
