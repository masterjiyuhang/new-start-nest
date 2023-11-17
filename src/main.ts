import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.use(passport.initialize());

  //2. 配置class-transformer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  //3. 配置class-validator
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  //1. 配置全局的验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      transformOptions: {
        excludeExtraneousValues: true,
      },
    }),
  );

  app.enableCors({
    origin: '127.0.0.1',
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
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
