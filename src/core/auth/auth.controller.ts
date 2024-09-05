import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import JwtRefreshGuard from 'src/common/guards/jwt-refresh.guard';
import { Request } from 'express';

type AuthorizedRequest = Request & {
  headers: { authorization: string };
  user: User;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  signIn(@Body() body: LoginUserDto) {
    return this.authService.login(body.username, body.password);
  }

  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  public check(@Req() req: any): User {
    return req.user.toResponseObject();
  }

  @Public()
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public refresh(@Req() req: AuthorizedRequest) {
    console.log(
      '🚀 ~ file: auth.controller.ts:51 ~ AuthController ~ refresh ~ req:',
      req.user,
    );
    return this.authService.refreshToken(req.user);
  }
}
