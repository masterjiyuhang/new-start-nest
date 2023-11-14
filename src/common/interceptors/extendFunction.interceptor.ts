import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ExtendFunctionBehaviorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Extending basic function behavior (e.g., adding a custom property to the request)
    const request = context.switchToHttp().getRequest();
    request.customProperty = 'Extended Property';

    return next.handle();
  }
}
