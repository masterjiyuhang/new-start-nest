import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarType } from './entities/car-type.entity';
import { Repository } from 'typeorm';
import { ApiException } from 'src/common/filters/exception-list';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

@Injectable()
export class CarTypeService {
  constructor(
    @InjectRepository(CarType)
    private carTypeRepository: Repository<CarType>,
  ) {}
  async create(createCarTypeDto: CreateCarTypeDto) {
    // return 'This action adds a new carType';
    const { car_type_name, car_type_code, car_type_desc } = createCarTypeDto;
    const existCarType = await this.carTypeRepository.findOne({
      where: { car_type_name },
    });

    if (existCarType)
      throw new ApiException('车辆类型已存在', ApiErrorCode.CAR_TYPE_EXIST);

    return this.carTypeRepository.save({
      car_type_name,
      car_type_code,
      car_type_desc,
    });
  }

  findAll() {
    return this.carTypeRepository.findAndCount();
  }

  async findOne(id: string) {
    // return `This action returns a #${id} carType`;
    const carType = await this.carTypeRepository.find({
      where: {
        id,
      },
    });

    if (!carType) {
      throw new HttpException('车辆类型不存在', HttpStatus.NOT_FOUND);
    }

    return carType;
  }

  async update(id: number, updateCarTypeDto: UpdateCarTypeDto) {
    const { car_type_name, car_type_code, car_type_desc } = updateCarTypeDto;
    const existCarType = await this.carTypeRepository.findOne({
      where: { car_type_name },
    });

    if (!existCarType)
      throw new HttpException('车辆类型不存在', HttpStatus.NOT_FOUND);

    return this.carTypeRepository.update(id, {
      car_type_name,
      car_type_code,
      car_type_desc,
    });
  }

  async remove(id: string) {
    const existingCarType = await this.findOne(id);
    return this.carTypeRepository.remove(existingCarType);
  }
}
