import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ where: { username } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    return this.save(user);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await this.update(id, userData);
    return this.findOne({ where: { id } });
  }
}