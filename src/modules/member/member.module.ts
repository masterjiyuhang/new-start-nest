import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { Member } from './entities/member.entity';
import { User } from 'src/core/user/entities/user.entity';
import { UserMembership } from './entities/user-membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, User, UserMembership])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
