import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiException } from './exception-list';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof ApiException) {
      response.status(status).json({
        code: exception.getErrorCode(),
        timestamp: new Date().toISOString(),
        path: request.url,
        describe: exception.getErrorMessage(),
      });
      return;
    }
    // 获取当前日期时间
    const currentDate = new Date();

    // 获取当前时间戳（以毫秒为单位）
    const currentTime = currentDate.getTime();

    // 增加8小时（8小时 * 60分钟 * 60秒 * 1000毫秒）
    const adjustedTime = currentTime + 8 * 60 * 60 * 1000;

    // 创建一个新的Date对象，使用调整后的时间戳
    const adjustedDate = new Date(adjustedTime);

    // 转换为ISO字符串格式
    const isoString = adjustedDate.toISOString();

    console.log(
      '🚀 ~ file: http-exception.filter.ts:41 ~ HttpExceptionFilter ~ isoString:',
      isoString,
    );
    response.status(status).json({
      code: status,
      timestamp: isoString,
      url: request.url,
      describe: (exception as any)?.response?.message || exception.message,
    });
  }
}
