import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 20000,
      maxRedirects: 3,
    }),
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
