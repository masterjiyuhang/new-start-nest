import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateMemberDto } from './dto/create-member.dto';
import {
  AddUserMemberDto,
  UpdateMemberDto,
  UpdateUserMemberDto,
} from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { DataSource, In, Repository } from 'typeorm';
import { User } from 'src/core/user/entities/user.entity';
import { UserMembership } from './entities/user-membership.entity';
import { Request } from 'express';
import { ApiException } from 'src/common/filters/exception-list';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private dataSource: DataSource,
  ) {}
  async create(createMemberDto: CreateMemberDto): Promise<CreateMemberDto> {
    const { member_name: name } = createMemberDto;
    let member: Member = null;
    member = await this.memberRepository.findOne({
      where: {
        member_name: name,
      },
    });
    if (member) {
      throw new HttpException('Member already exists', HttpStatus.OK);
    }
    member = this.memberRepository.create(createMemberDto);
    return this.memberRepository.save(member);
  }

  findAll(): Promise<Member[]> {
    return this.memberRepository.find();
  }

  async findOne(name: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: {
        member_name: name,
      },
    });
    if (!member) {
      throw new Error(`Member with name ${name} not found.`);
    }
    return member;
  }

  async update(name: string, updateMemberDto: UpdateMemberDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    // 从连接池获得一个连接
    await queryRunner.connect();

    // 创建事务的异步方法
    await queryRunner.startTransaction();

    try {
      const member = await queryRunner.manager.findOne(Member, {
        where: {
          member_name: name,
        },
      });

      if (!member) {
        // 处理实体不存在的情况，可能需要抛出异常或进行其他逻辑
        throw new HttpException(
          `Member with name ${name} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const newMember: Member = Object.assign(member, updateMemberDto);

      await queryRunner.manager.save(newMember);

      // 提交事务  把数据写入表中
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error, '错误信息');
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    } finally {
      // 返回连接给连接池
      await queryRunner.release();
    }
  }

  async remove(name: string): Promise<void> {
    const existingMember = await this.findOne(name);
    existingMember.delete_flag = 1;
    existingMember.delete_time = new Date();
    await this.memberRepository.save(existingMember);
  }

  async addUserMember(payload: AddUserMemberDto, req: Request): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    // 创建事务的异步方法
    await queryRunner.startTransaction();
    try {
      const { member_code } = payload;

      const currentUser: User = req.user as User;

      const userMembershipRepository =
        queryRunner.manager.getRepository(UserMembership);
      const members = await queryRunner.manager.find(Member, {
        where: {
          member_code: In([member_code]),
        },
      });

      const mm = await queryRunner.manager.getRepository(Member).findOne({
        relations: {
          userMembership: true,
        },
        where: {
          member_code: member_code,
        },
      });

      // 检查是否已存在相同的记录
      const exists = mm.userMembership.filter(
        (i) => i.userId === currentUser.id,
      );

      if (exists && exists.length > 0) {
        throw new ApiException(
          'Record already exists for the user and member',
          ApiErrorCode.USER_MEMBER_EXIST,
        );
      }

      for (const member of members) {
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

        const currentUserMembership = userMembershipRepository.create({
          user: currentUser,
          member: member,
          service_start_time: new Date(),
          service_end_time: oneYearLater,
          order: -1,
        });
        await queryRunner.manager.save(currentUserMembership);
      }

      // 提交事务
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error, 'error...');
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 返回连接给连接池
      await queryRunner.release();
    }
  }

  async joinMembership(payload: UpdateUserMemberDto): Promise<void> {
    const { username, memberList } = payload;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    // 创建事务的异步方法
    await queryRunner.startTransaction();

    const user: User = await queryRunner.manager.findOne(User, {
      where: {
        username,
      },
    });

    const userMembershipRepository =
      queryRunner.manager.getRepository(UserMembership);

    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const members = await queryRunner.manager.find(Member, {
      where: {
        member_code: In(memberList),
      },
    });

    for (const m of members) {
      const userMembership = new UserMembership();

      userMembership.userId = user.id;
      userMembership.service_start_time = new Date();
      userMembership.service_end_time = oneMonthLater;
      userMembership.memberId = m.id;
      userMembership.order = -1;
      await userMembershipRepository.save(userMembership);
    }

    // 提交事务
    await queryRunner.commitTransaction();
  }
}
