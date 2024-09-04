import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { isEmpty } from 'lodash';

import { comparePassword, hashPassword } from '../../common/utils/bcrypt';
import { User } from './entities/user.entity';
import { ApiException } from 'src/common/filters/exception-list';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { CreateAdminDto, CreateUserDto } from './dto/create-user.dto';
import { Role } from '../role/entities/role.entity';
import { roleEnums } from 'src/common/enums/role.enums';
import { UpdateUserDto } from './dto/update-user.dto';

// This should be a real class/interface representing a user entity

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createMany(users: User[]) {
    await this.dataSource.transaction(async (manager) => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });
  }

  async createUser(payload: CreateUserDto | CreateAdminDto): Promise<string> {
    const { username, password, email, roleIds } = payload;
    // 默认给注册的用户赋值普通用户角色
    const rolesIdList = roleIds || [roleEnums.USER];
    const enHashPassword = hashPassword(password);
    const existUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!isEmpty(existUser)) {
      throw new ApiException('用户名已存在', ApiErrorCode.USER_EXIST);
    }
    try {
      const roles = await this.roleRepository.find({
        where: {
          id: In(rolesIdList),
        },
      });
      const newUser = this.userRepository.create({
        username,
        password: enHashPassword,
        email,
        roles,
      });
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findAll() {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      select: ['id', 'password'],
      where: { username },
    });
    if (!user) {
      throw new HttpException('用户名不存在~~~~', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByUserId(userId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user)
      throw new ApiException('用户不存在', ApiErrorCode.USER_NOT_EXIST);

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneOrFail({
      where: { email },
    });
  }

  async findRoleOrPermissionByUserId(
    userId: number,
  ): Promise<{ roles: string[]; permissions: string[] }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles.permissions'],
    });

    if (!user)
      throw new ApiException('用户不存在', ApiErrorCode.USER_NOT_EXIST);

    const returnRoles: string[] = user.roles.map((item) => {
      return item.id;
    });

    const permissions = user.roles.flatMap((role) => role.permissions);
    const returnPermissions = permissions.map((item) => {
      return item.id;
    });

    return {
      roles: returnRoles,
      permissions: returnPermissions,
    };
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return comparePassword(password, hashedPassword);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (user) {
      return await this.userRepository.save(user);
    } else {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
  }
}
