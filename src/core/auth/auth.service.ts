import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = {
      username: user.username,
      roles: user.roles,
      sub: user.userId,
      password: user.password,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
