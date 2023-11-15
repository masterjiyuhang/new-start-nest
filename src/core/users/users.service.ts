import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  private readonly users = [
    {
      userId: 1,
      username: 'erhang',
      roles: ['admin'],
      password: hashPassword('123456'),
    },
    {
      userId: 2,
      username: 'danny',
      roles: ['user', 'player'],
      password: hashPassword('guess'),
    },
  ];
  async createUser(payload: any): Promise<User> {
    const password = hashPassword(payload.password);

    try {
      this.users.push({
        ...payload,
        userId: 100,
        password: password,
      });
    } catch (error) {}
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findByUserId(userId: number): Promise<User | undefined> {
    return this.users.find((user) => user.userId === userId);
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return comparePassword(password, hashedPassword);
  }
}
