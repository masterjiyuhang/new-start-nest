import { Injectable, Logger } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';
@Injectable()
export class CarService {
  private readonly logger = new Logger(CarService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
  ) {}

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
    const job = this.schedulerRegistry.getCronJob('sixCron');

    job.stop();
    // 停止定时任务
    console.log(' 停止定时任务 sixCron 的时间：', job.lastDate());
    return this.cars;
  }

  findOne(id: number): Car {
    return this.cars.find((car) => car.id === id);
  }

  async testAxios(token: string): Promise<Car[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Car[]>('http://localhost:3000/v1/api/car/list', {
          headers: {
            Authorization: token,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
}
