import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { CoreModule } from './core/core.module';
import { CarModule } from './modules/cars/car.module';
import { defaultConfig, baseConfig } from './common/config';

@Module({
  imports: [
    CoreModule,
    CarModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [baseConfig, defaultConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const dbConfig = {
          ...config.get<TypeOrmModuleOptions>('baseConfig')['db'],
        };
        console.log('Database connection configuration:', dbConfig);
        return dbConfig;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 直接为任何模块设置管道
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 全局应用中间件
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
