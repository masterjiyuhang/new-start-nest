import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../user/user.service';
import { Token } from './dto/token.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(username: string, password: string): Promise<Token> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`No user found for username: ${username}`);
    }

    const passwordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: number): Promise<User> {
    return this.usersService.findByUserId(userId);
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.usersService.findByUserId(id);
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: number }): string {
    const jwtRefreshSecret = this.configService.get('jwtRefreshSecret');
    const RefreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: '7d', // Set greater than the expiresIn of the access_token
    });
    return RefreshToken;
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
