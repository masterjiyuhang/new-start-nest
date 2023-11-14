import { ValidationPipe } from './../common/pipes/validation.pipe';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CrateCarDto } from './dto/create-car.dto';
import { CarService } from './car.service';
import { Car } from './interfaces/car.interface';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CarByIdPipe } from '../common/pipes/CarById.pipe';

@ApiTags('Car')
@UseGuards(RolesGuard)
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('list')
  @Roles(['admin'])
  async findAll(): Promise<Car[]> {
    return this.carService.findAll();
  }

  @Public()
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

  @Post('create')
  @Header('Content-Type', 'application/json')
  create(
    @Body(new ValidationPipe())
    { name, color, years, isOverload = false }: CrateCarDto,
  ): void {
    const id = this.carService.findAll().slice(-1)[0].id + 1;
    return this.carService.create({ id, name, color, years, isOverload });
  }
}
