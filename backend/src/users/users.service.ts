import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(userData: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    return this.usersRepository.createUser(userData);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    return this.usersRepository.updateUser(id, userData);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}