import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { ApiException } from 'src/common/filters/exception-list';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const name = createPermissionDto.name;
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: name },
    });
    if (existingPermission) {
      throw new ApiException(
        `此权限字段 ${name} 已存在`,
        ApiErrorCode.PERMISSION_EXIST,
      );
    }
    return await this.permissionRepository.save(createPermissionDto);
  }

  findAll() {
    return `This action returns all permission`;
  }

  async findOne(name: string) {
    const permission = await this.permissionRepository.findOne({
      where: { name },
    });
    if (!permission) {
      throw new HttpException(`此权限字段不存在`, HttpStatus.NOT_FOUND);
    }
    return permission;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission ${updatePermissionDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
