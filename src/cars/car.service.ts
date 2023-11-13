import { Injectable } from '@nestjs/common';
import { Car } from './interfaces/car.interface';

@Injectable()
export class CarService {
  private readonly cars: Car[] = [
    {
      name: '大黄蜂',
      years: 100,
      color: 'yellow',
      isOverload: true,
    },
  ];

  create(car: Car) {
    console.log(car, 'car service created');
    this.cars.push(car);
  }

  findAll(): Car[] {
    return this.cars;
  }
}
