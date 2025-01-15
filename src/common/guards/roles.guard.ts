import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  // HttpException,
  // HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ROLE_DECORATOR_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
// import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const guardRoles = this.reflector.getAllAndOverride<string[] | undefined>(
      ROLE_DECORATOR_KEY,
      [
        context.getHandler(), // Method Roles
        context.getClass(), // Controller Roles
      ],
    );
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(), // Method Roles
        context.getClass(), // Controller Roles
      ],
    );
    if (isPublic) {
      return true;
    }
    if (!guardRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { userRoles } = request;
    if (!userRoles) {
      return false;
    }

    // 当守卫返回 false 时，框架会抛出一个 ForbiddenException 异常
    const currentUserRoles = userRoles ?? [];
    const canGo = currentUserRoles.some((role: string) =>
      guardRoles.includes(role),
    );
    if (!canGo) {
      throw new HttpException('当前用户权限不足', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
