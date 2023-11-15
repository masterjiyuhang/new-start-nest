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
    const roles = this.reflector.getAllAndOverride<string[] | undefined>(
      'roles',
      [
        context.getHandler(), // Method Roles
        context.getClass(), // Controller Roles
      ],
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) {
      return false;
    }

    // console.log(roles);

    // const hasRole = () =>
    //   user.roles.some((role) => !!roles.find((item) => item === role));
    // if (!(user && user.roles && hasRole())) {
    //   throw new HttpException('当前用户权限不足', HttpStatus.FORBIDDEN);
    // }

    // return true;

    // 当守卫返回 false 时，框架会抛出一个 ForbiddenException 异常
    const currentUserRoles = user.roles ?? [];
    const canGo = currentUserRoles.some((role: string) => roles.includes(role));
    if (!canGo) {
      throw new HttpException('当前用户权限不足', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
