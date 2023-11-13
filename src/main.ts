import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableCors({
    origin: '127.0.0.1',
  });

  // 设置全局前缀
  app.setGlobalPrefix('/v1/api');

  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('The v1 API description')
    .setVersion('1.0')
    .setBasePath('/v1/api')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
