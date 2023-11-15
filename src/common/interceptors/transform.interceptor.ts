import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  // 构造函数是在模块加载时调用的，而不是在运行时每次请求时调用的。因此，你无法在构造函数中获取到请求特定的信息，例如 customMsg。
  // constructor(private readonly customMsg?: string) {
  //   console.log(this.customMsg);
  // }

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        data,
        msg: '请求成功！',
      })),
    );
  }
}
