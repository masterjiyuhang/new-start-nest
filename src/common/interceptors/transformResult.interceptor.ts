import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class TransformResultInterceptor implements NestInterceptor {
  /**
   * 拦截器函数，用于在请求处理前后执行自定义逻辑
   *
   * @param context 执行上下文，包含了有关当前请求和路由的信息
   * @param next 调用处理程序，用于执行下一个中间件或最终的路由处理器
   * @returns 返回一个Observable，其中包含经过自定义逻辑处理后的数据
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 使用CallHandler的handle方法继续执行请求，并在请求执行后对返回数据进行处理
    return next.handle().pipe(map((data) => ({ result: data })));
  }
}
