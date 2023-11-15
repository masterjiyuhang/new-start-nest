import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { Public } from '../../common/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: '注册接口', // 接口描述信息
  })
  create(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }
}
