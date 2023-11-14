import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RewriteFunctionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Completely rewriting the function based on a condition
    if (context.getType() === 'http') {
      console.log(111);
    }

    const request = context.switchToHttp().getRequest();
    if (request.shouldRewrite) {
      return new Observable((observer) => {
        observer.next({ message: 'Function Completely Rewritten' });
        observer.complete();
      });
    }

    return next.handle();
  }
}
