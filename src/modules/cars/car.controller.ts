import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateCarDto } from './dto/create-car.dto';
import { CarService } from './car.service';
import { Car } from './interfaces/car.interface';
import { CustomerValidationPipe } from '../../common/pipes/validation.pipe';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { roleEnums } from 'src/common/enums/role.enums';
import { Public } from '../../common/decorators/public.decorator';
import { CarByIdPipe, CarByNamePipe } from '../../common/pipes/Car.pipe';
import { Request } from 'express';
import { UpdateCarDto } from './dto/update-car.dto';
import { NoCacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@ApiTags('Car')
@UseGuards(RolesGuard)
@Controller('car')
@Public()
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('list')
  @UseInterceptors(NoCacheInterceptor)
  async findAll(
    @Query('isOverload', new DefaultValuePipe(false), ParseBoolPipe)
    isOverLoadOnly?: boolean,
    @Query('name') name?: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size?: number,
  ) {
    console.log(isOverLoadOnly, page, 'list params');
    const [list, total] = await this.carService.findListByName(
      page,
      size,
      name,
      isOverLoadOnly,
    );
    return {
      list,
      total,
      page,
    };
  }

  @Get('err')
  async getError(): Promise<any> {
    throw new HttpException(
      {
        message: 'this is an error',
        status: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  @Get('/findOne/:id')
  @Header('Content-Type', 'application/json')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'car id',
  })
  @Roles(roleEnums.ADMIN, roleEnums.SUPER_ADMIN, roleEnums.USER)
  findOne(@Param('id', ParseIntPipe) id: number | string): any {
    return {
      id: id,
      name: '一个车车',
    };
  }

  @Get('getByName')
  async getByName(@Body('name', CarByNamePipe) car: Car) {
    return car;
  }

  @Get('/detail/:id')
  @ApiParam({
    name: 'id',
    type: String,
    description: '根据id查询汽车详情',
  })
  async getDetailById(@Param('id', CarByIdPipe) car: Car) {
    return car;
  }

  @Post('getListByName')
  @ApiParam({
    name: '汽车名称',
    type: String,
    description: '根据汽车名称进行模糊查询',
  })
  @HttpCode(HttpStatus.OK)
  async getListByName(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Body('name') name?: string,
  ) {
    const [list, total] = await this.carService.findListByName(
      page,
      limit,
      name,
    );
    return {
      list,
      total,
      page: page + 1,
      size: limit,
    };
  }

  @Get('testAxios')
  async test(@Req() req: Request) {
    console.log(req);
    return await this.carService.testAxios(req.headers.authorization || '');
  }

  @Post('create')
  @Header('Content-Type', 'application/json')
  async create(
    @Body(new CustomerValidationPipe())
    payload: CreateCarDto,
  ) {
    console.log(payload, '创建的参数');
    return await this.carService.create(payload);
  }

  @Post('update')
  @Header('Content-Type', 'application/json')
  async update(@Body(new CustomerValidationPipe()) payload: UpdateCarDto) {
    return await this.carService.update(payload);
  }

  @Post('del')
  async remove(@Body('vin') vinCode: string) {
    return await this.carService.remove(vinCode);
  }

  @Post('setType')
  async setType(@Body() updateCarDto: UpdateCarDto) {
    return await this.carService.setCarType(updateCarDto);
  }
}
