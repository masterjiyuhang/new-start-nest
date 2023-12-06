import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { DataSource, Repository } from 'typeorm';

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
}
