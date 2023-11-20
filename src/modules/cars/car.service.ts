import { Injectable } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class CarService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  private readonly cars: Car[] = [
    {
      id: 1,
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
    const job = this.schedulerRegistry.getCronJob('');

    job.stop();
    // 停止定时任务
    console.log(' 停止定时任务 sixCron 的时间：', job.lastDate());
    return this.cars;
  }

  findOne(id: number): Car {
    return this.cars.find((car) => car.id === id);
  }
}
