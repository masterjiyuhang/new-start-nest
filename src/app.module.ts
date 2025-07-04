import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { CoreModule } from './core/core.module';
import { CarModule } from './modules/cars/car.module';
import { defaultConfig, baseConfig, envConfig } from './common/config';
import { UploadModule } from './modules/upload/upload.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CarTypeModule } from './modules/car-type/car-type.module';
import { MemberModule } from './modules/member/member.module';
import { DogsModule } from './modules/dogs/dogs.module';
import { RankListModule } from './modules/rank-list/rank-list.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envConfig[process.env.NODE_ENV] || '.env',
      load: [baseConfig, defaultConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = {
          ...config.get<TypeOrmModuleOptions>('baseConfig')['db'],
        };
        return dbConfig;
      },
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: process.env.REDIS_URL,
        options: {
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),
    PassportModule,
    CoreModule,
    CarModule,
    CarTypeModule,
    UploadModule,
    TasksModule,
    MemberModule,
    DogsModule,
    RankListModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
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
