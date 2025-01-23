import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/entities/user.entity';
import { JwtDto } from './dto/jwt.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('jwtRefreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtDto): Promise<User> {
    console.log(
      '🍉 ~ file: jwt-refresh.strategy.ts:26 ~ validate ~ payload:',
      payload.userId,
      payload,
    );
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
