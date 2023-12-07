import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';
import { UserController } from './user.controller';
import { Role } from '../role/entities/role.entity';
import { Member } from 'src/modules/member/entities/member.entity';
import { UserMembership } from 'src/modules/member/entities/user-membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Member, UserMembership])],
  providers: [UserService, UserSubscriber],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
