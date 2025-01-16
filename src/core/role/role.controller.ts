import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { roleEnums } from 'src/common/enums/role.enums';

@ApiTags('Role')
@Controller('role')
@UseGuards(RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @Roles(roleEnums.SUPER_ADMIN)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get('findAll')
  @Roles(roleEnums.SUPER_ADMIN, roleEnums.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('name') name?: string,
    @Query('code') code?: string,
  ) {
    const [list, total] = await this.roleService.findAll(
      page,
      limit,
      name,
      code,
    );
    return {
      list,
      total,
    };
  }

  @Get(':code')
  @Roles(roleEnums.SUPER_ADMIN)
  findOne(@Param('code') code: string) {
    return this.roleService.findOne(code);
  }

  @Patch('update/:id')
  @Roles(roleEnums.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete('del/:id')
  @Roles(roleEnums.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
