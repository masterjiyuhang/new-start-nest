import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarTypeService } from './car-type.service';
import { CarTypeController } from './car-type.controller';
import { CarType } from './entities/car-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarType])],
  controllers: [CarTypeController],
  providers: [CarTypeService],
})
export class CarTypeModule {}
