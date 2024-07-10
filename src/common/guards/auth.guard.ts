import { UserService } from '../../core/user/user.service';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { defaultConfig } from '../config/index';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    console.log('global auth guard is executed.');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: defaultConfig().jwtSecret,
      });

      const { userId } = payload;
      const currentUser = await this.usersService.findByUserId(userId);
      const { roles, permissions } =
        await this.usersService.findRoleOrPermissionByUserId(userId);

      request['userRoles'] = roles;
      request['userPermissions'] = permissions;
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = currentUser;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('token expired');
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
