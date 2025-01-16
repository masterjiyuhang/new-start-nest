import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { ApiException } from 'src/common/filters/exception-list';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { roleEnums } from 'src/common/enums/role.enums';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, desc, code, permissionCodes } = createRoleDto;
    const existRole = await this.roleRepository.findOne({
      where: { name },
    });

    if (existRole)
      throw new ApiException('角色已存在', ApiErrorCode.ROLE_EXIST);

    // 查询传入数组permissionIds的全部permission实体
    const permissions = await this.permissionRepository.find({
      where: {
        code: In(permissionCodes),
      },
    });

    // return 'This action adds a new role';
    return this.roleRepository.save({ permissions, name, desc, code });
  }

  async findAll(
    page: number,
    limit: number,
    name?: string,
    code?: string,
  ): Promise<[Role[], number]> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${name}%` });
    }
    if (code) {
      queryBuilder.andWhere('role.code LIKE :code', { code: `%${code}%` });
    }

    queryBuilder.skip(page * limit).take(limit);

    const [result, total] = await queryBuilder.getManyAndCount();
    const res = result.filter(
      (item) => item.code !== roleEnums.SUPER_ADMIN + '',
    );
    return [res, total === res.length ? total : res.length];
  }

  async findOne(code: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        code,
      },
    });
    if (!role) {
      throw new NotFoundException(`Role with code ${code} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    this.roleRepository.merge(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async delete(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
