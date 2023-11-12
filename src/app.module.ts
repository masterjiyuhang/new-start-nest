import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { CarModule } from './cars/car.module';

@Module({
  imports: [CoreModule, CarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
