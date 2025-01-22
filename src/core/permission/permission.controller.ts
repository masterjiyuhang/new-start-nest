import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatorIdInterceptor } from 'src/common/interceptors/creator-id.interceptor';
import { OperatorIdInterceptor } from 'src/common/interceptors/operator_id.interceptor';
import { Request } from 'express';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @UseInterceptors(CreatorIdInterceptor, OperatorIdInterceptor)
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Req() req: Request,
  ) {
    return this.permissionService.create(createPermissionDto, req);
  }

  @Get('list')
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('name') name?: string,
  ) {
    const [list, total] = await this.permissionService.findAll(
      page,
      limit,
      name,
    );
    return {
      list,
      total,
    };
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.permissionService.findOne(name);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
