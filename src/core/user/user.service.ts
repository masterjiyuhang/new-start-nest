import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { isEmpty } from 'lodash';

import { comparePassword, hashPassword } from '../../common/utils/bcrypt';
import { User } from './entities/user.entity';
import { ApiException } from 'src/common/filters/exception-list';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import {
  CreateAdminDto,
  CreateUserDto,
  WeChatUserDto,
} from './dto/create-user.dto';
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

  async createUser(
    payload: CreateUserDto | CreateAdminDto | WeChatUserDto,
  ): Promise<string | User> {
    if ('openid' in payload) {
      return this.createUserByWeChat(payload);
    }
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
      console.log(
        '🍉 ~ file: user.service.ts:63 ~ UserService ~ roles:',
        roles,
      );
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

  async createUserByWeChat(payload: WeChatUserDto) {
    const { openid, nickname, avatarUrl } = payload;

    const existUser = await this.userRepository.findOne({
      where: { openid },
    });

    if (!isEmpty(existUser)) {
      // 如果用户已存在，可根据实际需求返回相应提示或进行其他操作（比如更新用户信息等）
      throw new ApiException('该微信账号已绑定用户', ApiErrorCode.USER_EXIST);
    }
    const roles = await this.roleRepository.find({
      where: {
        id: In([roleEnums.USER]),
      },
    });
    try {
      const newUser = this.userRepository.create({
        openid,
        // password: openid,
        wechatNickname: nickname,
        wechatAvatar: avatarUrl,
        roles: roles, // 赋予默认角色，比如普通用户角色，可根据实际调整
      });
      console.log(
        '🍉 ~ file: user.service.ts:99 ~ UserService ~ createUserByWeChat ~ newUser:',
        newUser,
      );
      await this.userRepository.save(newUser);
      return newUser;
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

  /**
   * 根据用户的OpenID异步查找用户信息
   * 此函数尝试通过用户的OpenID在数据库中查找对应的用户
   * 如果找到用户，则返回该用户对象；如果未找到，则返回null
   *
   * @param openid 用户的唯一OpenID，用于在数据库中查找用户
   * @returns Promise<User | null> 返回一个Promise，解析为用户对象或null
   */
  async findByOpenid(openid: string) {
    // 使用传入的OpenID在用户仓库中查找用户
    const user = await this.userRepository.findOne({
      where: { openid },
    });

    // 如果没有找到用户，返回null
    if (!user) return null;

    // 返回找到的用户对象
    return user;
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
