import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CarService } from '../../cars/car.service';

@Injectable()
export class CarByIdPipe implements PipeTransform<string> {
  constructor(private readonly carService: CarService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    console.log(metadata, value);
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    const car = this.carService.findOne(val);
    if (car) {
      return car;
    } else {
      throw new HttpException(
        `No car with ID ${val} found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
