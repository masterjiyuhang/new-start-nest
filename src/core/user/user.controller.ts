import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { Public } from '../../common/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '注册普通用户接口', // 接口描述信息
  })
  @Public()
  @Post('register')
  create(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @ApiOperation({
    summary: '修改密码',
  })
  @Public()
  @Post('changePassword')
  changePassword(@Body() payload: ChangePasswordDto) {
    return this.userService.changePassword(payload);
  }
}
