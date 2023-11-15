import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { comparePassword, hashPassword } from '../../common/utils/bcrypt';
import { User } from './entities/user.entity';
import { ApiException } from 'src/common/filters/exception-list';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmpty } from 'lodash';

// This should be a real class/interface representing a user entity

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createMany(users: User[]) {
    await this.dataSource.transaction(async (manager) => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });
  }

  async createUser(payload: CreateUserDto): Promise<string> {
    const { username, password, email, roleIds } = payload;
    console.log(roleIds, 'roles id..');
    const enHashPassword = hashPassword(password);
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (!isEmpty(existUser)) {
      throw new ApiException('用户名已存在', ApiErrorCode.USER_EXIST);
    }
    const newUser = this.userRepository.create({
      username,
      password: enHashPassword,
      email,
    });
    await this.userRepository.save(newUser);
    return '注册成功';
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new HttpException('用户名不存在~~~~', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByUserId(userId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user)
      throw new ApiException('用户不存在', ApiErrorCode.USER_NOT_EXIST);
    return user;
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return comparePassword(password, hashedPassword);
  }
}
