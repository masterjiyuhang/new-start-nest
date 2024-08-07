import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Like, Repository } from 'typeorm';
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
  }

  async remove(name: string): Promise<void> {
    const existCar = await this.carRepository.findOne({
      where: { title: name },
    });

    if (!existCar) throw new HttpException('车辆不存在', HttpStatus.NOT_FOUND);

    existCar.delete_flag = 1;
    existCar.delete_time = new Date();
    await this.carRepository.save(existCar);
  }

  // 设置车辆类型
  async setCarType(updateCarDto: UpdateCarDto) {
    const { car_type, title } = updateCarDto;
    const existCar = await this.carRepository.findOne({
      where: { title: title },
    });
    if (!existCar) throw new HttpException('车辆不存在', HttpStatus.NOT_FOUND);
    const type = await this.carTypeRepository.find({
      where: {
        id: car_type,
      },
    });
    if (!type) throw new HttpException('车辆类型不存在', HttpStatus.NOT_FOUND);
    existCar.car_type = type;
    await this.carRepository.save(existCar);
  }

  findAll() {
    const job = this.schedulerRegistry.getCronJob('sixCron');
    job.stop();
    // 停止定时任务
    console.log(' 停止定时任务 sixCron 的时间：', job.lastDate());
    return this.carRepository.findAndCount();
  }

  async findOne(name: string) {
    return await this.carRepository.findOne({
      where: {
        title: name,
      },
      relations: ['car_type'],
      // 在 TypeORM 中，当你使用 relations 选项时，select 中必须包含主实体的主键字段。
      // 因为 TypeORM 在构建 SQL 查询时，需要确保能够通过主键字段正确定位主实体的记录。
      select: ['id', 'title', 'car_type'],
    });

    // return this.carRepository
    //   .createQueryBuilder('car')
    //   .leftJoinAndSelect('car.car_type', 'car_type')
    //   .select(['car.title', 'car_type.id'])
    //   .where('car.title = :name', { name: name })
    //   .getRawOne();
  }

  async findListByName(name: string): Promise<Car[]> {
    return await this.carRepository.find({
      where: {
        // 在数据库中进行模糊查询时，通常使用 % 符号表示通配符，它匹配任意字符序列
        title: Like(`%${name}%`),
      },
    });
  }

  async testAxios(token: string) {
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
