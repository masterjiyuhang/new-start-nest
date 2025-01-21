import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { CarService } from '../../modules/cars/car.service';

@Injectable()
export class CarByNamePipe implements PipeTransform<string> {
  constructor(private readonly carService: CarService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    console.log(
      '🍉 ~ file: Car.pipe.ts:17 ~ CarByNamePipe ~ transform ~ metadata:',
      metadata,
    );
    if (isEmpty(value)) {
      throw new BadRequestException('Validation failed');
    }
    const car = await this.carService.findOne(value);
    if (car) {
      return car;
    } else {
      throw new HttpException(
        `No car with Name ${value} found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

@Injectable()
export class CarByIdPipe implements PipeTransform<string> {
  constructor(private readonly carService: CarService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    console.log(
      '🍉 ~ file: Car.pipe.ts:38 ~ CarByIdPipe ~ transform ~ metadata:',
      value,
      metadata,
    );
    if (isEmpty(value)) {
      throw new BadRequestException('Validation failed');
    }
    const car = await this.carService.findOneById(value);
    if (car) {
      return car;
    }
  }
}
