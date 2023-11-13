import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CrateCarDto } from './dto/create-car.dto';
import { CarService } from './car.service';
import { Car } from './interfaces/car.interface';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';

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

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'car id',
  })
  findOne(@Param('id') id: number | string): any {
    return {
      id: id,
      name: '一个车',
    };
  }

  @Post('create')
  @Header('Content-Type', 'application/json')
  create(
    @Body() { name, color, years, isOverload = false }: CrateCarDto,
  ): void {
    return this.carService.create({ name, color, years, isOverload });
  }
}
