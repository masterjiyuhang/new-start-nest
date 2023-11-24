import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarController } from './car.controller';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';
import { CarType } from '../car-type/entities/car-type.entity';

@Module({
  imports: [
    HttpModule.register({
      timeout: 20000,
      maxRedirects: 3,
    }),
    TypeOrmModule.forFeature([Car, CarType]),
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
