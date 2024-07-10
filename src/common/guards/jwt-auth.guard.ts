import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public override getRequest(context: ExecutionContext): Request {
    try {
      if (context.getType<GqlContextType>() === 'graphql') {
        const ctx = GqlExecutionContext.create(context).getContext<{
          req: Request;
        }>();
        if (!ctx || !ctx.req) {
          throw new UnauthorizedException(
            'GraphQL context does not contain a valid request object.',
          );
        }

        return ctx.req;
      } else {
        // 对于HTTP上下文，同样显式处理异常
        const request = context.switchToHttp().getRequest<Request>();
        if (!request) {
          throw new UnauthorizedException(
            'HTTP context does not contain a valid request object.',
          );
        }
      }
    } catch (error) {
      // 异常处理
      // 根据函数的要求，无法改变函数的输出类型，但遇到错误应避免返回null或抛出异常
      throw new UnauthorizedException(
        'Failed to retrieve request from execution context:',
        error,
      );
    }
  }
}
