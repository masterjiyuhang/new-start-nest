import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { In, Repository } from 'typeorm';
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
    const {
      title,
      city,
      years,
      color,
      transmission,
      is_over_load,
      vin,
      fuel_type,
      registration_date,
    } = payload;
    const existCar = await this.carRepository.findOne({
      where: { vin: vin },
    });

    this.logger.log(`开始创建车辆，VIN码为: ${vin}`);

    // if (existCar) throw new ApiException('车辆已存在', ApiErrorCode.CAR_EXIST);
    if (existCar) {
      this.logger.warn(`车辆已存在，VIN码为: ${vin}`);
      throw new ApiException('车辆已存在', ApiErrorCode.CAR_EXIST);
    }
    const savedCar = this.carRepository.create({
      title,
      city,
      years,
      color,
      transmission,
      is_over_load,
      vin,
      fuel_type,
      registration_date,
    });

    this.logger.log(`车辆创建成功，ID为: ${savedCar.id}`);
    return this.carRepository.save(savedCar);
  }

  async remove(vinCode: string): Promise<void> {
    const existCar = await this.carRepository.findOne({
      where: { vin: vinCode },
    });

    if (!existCar) throw new HttpException('车辆不存在', HttpStatus.NOT_FOUND);

    existCar.delete_flag = 1;
    existCar.delete_time = new Date();
    await this.carRepository.save(existCar);
  }

  async update(updateCarDto: UpdateCarDto) {
    const {
      id,
      is_over_load,
      title,
      city,
      years,
      transmission,
      color,
      vin,
      registration_date,
      fuel_type,
      car_type,
    } = updateCarDto;
    console.log(
      '🍉 ~ file: car.service.ts:79 ~ CarService ~ update ~ updateCarDto:',
      updateCarDto,
    );
    const existCar = await this.carRepository.findOne({
      where: { id: id },
    });
    if (!existCar) throw new HttpException('车辆不存在', HttpStatus.NOT_FOUND);

    if (car_type.length > 0) {
      const type = await this.carTypeRepository.find({
        where: {
          car_type_code: In(car_type),
        },
      });
      existCar.car_type = type;
    }
    console.log(
      '🍉 ~ file: car.service.ts:87 ~ CarService ~ update ~ existCar:',
      existCar,
    );

    existCar.is_over_load = is_over_load;
    existCar.title = title;
    existCar.city = city;
    existCar.years = years;
    existCar.transmission = transmission;
    existCar.color = color;
    existCar.vin = vin;
    existCar.registration_date = registration_date;
    existCar.fuel_type = fuel_type;

    await this.carRepository.update(existCar.id, existCar);
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
        car_type_code: In(car_type),
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
      select: ['id', 'title', 'color', 'city', 'years', 'car_type'],
    });
  }

  async findOneById(id: string) {
    return await this.carRepository.findOne({
      where: {
        id: id,
      },
      relations: ['car_type'],
      // 在 TypeORM 中，当你使用 relations 选项时，select 中必须包含主实体的主键字段。
      // 因为 TypeORM 在构建 SQL 查询时，需要确保能够通过主键字段正确定位主实体的记录。
      select: [
        'id',
        'title',
        'city',
        'years',
        'color',
        'transmission',
        'is_over_load',
        'platform',
        'platform_id',
        'vin',
        'registration_date',
        'fuel_type',
        'car_type',
      ],
    });
  }

  async findListByName(
    page: number,
    limit: number,
    name?: string,
    is_over_load?: boolean,
  ): Promise<[Car[], number]> {
    const queryBuilder = this.carRepository.createQueryBuilder('car');

    if (name) {
      queryBuilder.andWhere('car.title LIKE :title', {
        title: `%${name}%`,
      });
    }

    if (is_over_load !== undefined) {
      queryBuilder.andWhere('car.is_over_load = :is_over_load', {
        is_over_load: is_over_load,
      });
    }

    queryBuilder.skip(page * limit).take(limit);

    const [result, total] = await queryBuilder.getManyAndCount();
    return [result, total];
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
