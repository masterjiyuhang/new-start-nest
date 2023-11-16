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
// import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const roles: any = this.reflector.get(Roles, context.getHandler());
    const guardRoles = this.reflector.getAllAndOverride<string[] | undefined>(
      'roles',
      [
        context.getHandler(), // Method Roles
        context.getClass(), // Controller Roles
      ],
    );

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
