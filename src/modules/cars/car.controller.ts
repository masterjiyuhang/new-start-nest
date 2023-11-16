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
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CrateCarDto } from './dto/create-car.dto';
import { CarService } from './car.service';
import { Car } from './interfaces/car.interface';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CarByIdPipe } from '../../common/pipes/CarById.pipe';
import { roleEnums } from 'src/common/enums/role.enums';

@ApiTags('Car')
@UseGuards(RolesGuard)
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('list')
  @Roles(roleEnums.ADMIN, roleEnums.SUPER_ADMIN)
  async findAll(
    @Query('isOverload', new DefaultValuePipe(true), ParseBoolPipe)
    isOverLoadOnly?: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
  ): Promise<Car[]> {
    console.log(isOverLoadOnly, page, 'list params');
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
