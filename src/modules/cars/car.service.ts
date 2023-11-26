import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';
// import { CreateCarTypeDto } from '../car-type/dto/create-car-type.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { ApiException } from 'src/common/filters/exception-list';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { CarType } from '../car-type/entities/car-type.entity';
import { CreateCarDto } from './dto/create-car.dto';
@Injectable()
export class CarService {
  private readonly logger = new Logger(CarService.name);
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(CarType)
    private carTypeRepository: Repository<CarType>,
    private schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
  ) {}

  async create(payload: CreateCarDto) {
    const { title, city, years, color, transmission, is_over_load } = payload;
    const existCar = await this.carRepository.findOne({
      where: { title: title },
    });

    if (existCar) throw new ApiException('车辆已存在', ApiErrorCode.CAR_EXIST);
    const newCar = this.carRepository.create({
      title,
      city,
      years,
      color,
      transmission,
      is_over_load,
    });
    return this.carRepository.save(newCar);
    // return new Promise((resolve) => {
    //   resolve(newCar);
    // });
    // const newCar = this.carRepository.create(payload);
    // return this.carRepository.save(newCar);
  }

  async setCarType(updateCarDto: UpdateCarDto) {
    // const { car_type, id } = updateCarDto;
    // const existCar = await this.carRepository.findOne({
    //   where: { id: id },
    // });
    // if (!existCar) throw new HttpException('车辆不存在', HttpStatus.NOT_FOUND);
    // const type = await this.carTypeRepository.find({
    //   where: {
    //     id: car_type,
    //   },
    // });
    // if (!type) throw new HttpException('车辆类型不存在', HttpStatus.NOT_FOUND);
    // const car = {
    //   ...existCar,
    //   car_type: type,
    // };
    // await this.carRepository.save(car);
  }

  findAll() {
    const job = this.schedulerRegistry.getCronJob('sixCron');
    job.stop();
    // 停止定时任务
    console.log(' 停止定时任务 sixCron 的时间：', job.lastDate());
    return this.carRepository.findAndCount();
  }

  async findOne(id: number) {
    return await this.carRepository.findOne({
      where: {
        id,
      },
    });
  }

  async testAxios(token: string) {
    // const { data } = await firstValueFrom(
    //   this.httpService
    //     .get<Car[]>('http://localhost:3000/v1/api/car/list', {
    //       headers: {
    //         Authorization: token,
    //       },
    //     })
    //     .pipe(
    //       catchError((error: AxiosError) => {
    //         this.logger.error(error.response.data);
    //         throw 'An error happened!';
    //       }),
    //     ),
    // );
    // return data;
  }
}
