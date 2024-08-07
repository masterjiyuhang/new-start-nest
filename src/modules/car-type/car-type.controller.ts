import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { CarTypeService } from './car-type.service';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('carType')
@Controller('carType')
export class CarTypeController {
  constructor(private readonly carTypeService: CarTypeService) {}

  @Post('create')
  async create(@Req() req: any, @Body() createCarTypeDto: CreateCarTypeDto) {
    const result = await this.carTypeService.create(createCarTypeDto, req.user);
    return result;
  }

  @Get('all')
  async findAll() {
    const [carTypes, totalCount] = await this.carTypeService.findAll();
    return {
      car_type_list: carTypes,
      total: totalCount,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carTypeService.findOne(id);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateCarTypeDto: UpdateCarTypeDto) {
    return this.carTypeService.update(+id, updateCarTypeDto);
  }

  @Post('del/:id')
  remove(@Param('id') id: string) {
    return this.carTypeService.remove(id);
  }
}
