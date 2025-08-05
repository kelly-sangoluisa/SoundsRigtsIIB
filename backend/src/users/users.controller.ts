import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class UpdateUserDto {
  username?: string;
  email?: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    if (req.user.userId !== +id) {
      throw new Error('You can only update your own profile');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.userId !== +id) {
      throw new Error('You can only delete your own account');
    }
    return this.usersService.remove(+id);
  }
}