// creator-id.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OperatorIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // 假设全局Guard已经将userId添加到request对象中

    if (request.body) {
      request.body.operator_id = user.id; // 将userId添加到请求体中
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
