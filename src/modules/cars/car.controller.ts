import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
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
import { CarByIdPipe } from '../../common/pipes/CarById.pipe';
import { Request } from 'express';

@ApiTags('Car')
@UseGuards(RolesGuard)
@Controller('car')
@Public()
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('list')
  // @Roles(roleEnums.ADMIN, roleEnums.SUPER_ADMIN)
  async findAll(
    @Query('isOverload', new DefaultValuePipe(true), ParseBoolPipe)
    isOverLoadOnly?: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
  ) {
    console.log(isOverLoadOnly, page, 'list params');
    // const [list, total] = await this.carService.findAll();
    // return {
    //   list,
    //   total,
    // };
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

  @Get('getById')
  async getById(@Query('id', CarByIdPipe) car: Car) {
    return car;
  }

  @Get('testAxios')
  async test(@Req() req: Request) {
    console.log(req);
    return this.carService.testAxios(req.headers.authorization);
  }

  @Post('create')
  @Header('Content-Type', 'application/json')
  create(
    @Body(new CustomerValidationPipe())
    payload: CreateCarDto,
  ) {
    console.log(payload, '创建的参数');
    return this.carService.create(payload);
  }
}
