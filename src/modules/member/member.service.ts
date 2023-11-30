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
    let member = null;
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

  async findOne(name: string) {
    const member = await this.memberRepository.findOne({
      where: {
        member_name: name,
      },
    });
    if (!member) {
      throw new HttpException(
        `Car with name ${name} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return member;
  }

  async update(name: string, updateMemberDto: UpdateMemberDto) {
    // const member = this.memberRepository.findOne({
    //   where: {
    //     member_name: name,
    //   },
    // });

    // if (!member)
    //   throw new HttpException(
    //     `Car with name ${name} not found.`,
    //     HttpStatus.NOT_FOUND,
    //   );

    const queryRunner = this.dataSource.createQueryRunner();
    // 从连接池获得一个连接
    await queryRunner.connect();

    // 创建事务的异步方法
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.findOne(Member, {
        where: {
          member_name: name,
        },
      });

      await queryRunner.manager.save(Member, {
        data: {
          updateMemberDto,
        },
      });

      // 提交事务  把数据写入表中
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error, '错误信息');
      await queryRunner.rollbackTransaction();
    } finally {
      // 返回连接给连接池
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
