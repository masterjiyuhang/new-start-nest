import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserSubscriber],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
