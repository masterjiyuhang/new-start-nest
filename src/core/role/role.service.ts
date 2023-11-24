import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { ApiException } from 'src/common/filters/exception-list';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, desc, code, permissionIds } = createRoleDto;
    const existRole = await this.roleRepository.findOne({
      where: { name },
    });

    if (existRole)
      throw new ApiException('角色已存在', ApiErrorCode.ROLE_EXIST);

    // 查询传入数组permissionIds的全部permission实体
    const permissions = await this.permissionRepository.find({
      where: {
        id: In(permissionIds),
      },
    });

    // return 'This action adds a new role';
    return this.roleRepository.save({ permissions, name, desc, code });
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role ${updateRoleDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
