import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log(
    '🚀 ~ file: main.ts:72 ~ process.env.NODE_ENV:',
    process.env.NODE_ENV,
  );
  console.log(
    '🚀 ~ file: main.ts:72 ~ process.env.NODE_ENV:',
    process.env.DATABASE_NAME,
  );
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    // logger: ['error', 'warn'],
  });

  app.use(passport.initialize());
  //1. 配置全局的验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      transformOptions: {
        excludeExtraneousValues: false,
      },
    }),
  );
  //2. 配置class-transformer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  //3. 配置class-validator
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  // 修改 CORS 配置
  app.enableCors({
    origin: [
      '127.0.0.1',
      process.env.ENABLE_DOMAIN,
      'https://masterjiyuhang.github.io',
      'https://new-start-vue.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的请求方法
    allowedHeaders:
      'Accept,Content-Type,X-Requested-With,Authorization,X-Custom-Header', // 允许的请求头
    credentials: true, // 允许携带凭证（如 cookies）
  });

  // 设置全局前缀
  app.setGlobalPrefix('/v1/api');
  // 设置全局异常拦截 该 useGlobalFilters() 方法不会为网关和混合应用程序设置过滤器。
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('The v1 API description')
    .setVersion('1.0')
    // .addServer('/v1/api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document);

  const rrr = join(__dirname, 'images');
  app.useStaticAssets(rrr, {
    prefix: '/images',
  });

  await app.listen(process.env.PORT || 3001);
  console.log(
    process.env.PORT,
    `Application is running on: ${await app.getUrl()}`,
  );
}

bootstrap();
