import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import JwtRefreshGuard from 'src/common/guards/jwt-refresh.guard';
import { Request } from 'express';
import { RsaService } from '../rsa/rsa.service';

type AuthorizedRequest = Request & {
  headers: { authorization: string };
  user: User;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly rsaService: RsaService,
  ) {}

  @Public()
  @Get('publicKey')
  getPublicKey() {
    return this.rsaService.getPublicKey();
  }

  @Public()
  @Post('encryptPwd')
  @ApiParam({
    name: '密码',
    type: String,
    description: '获取公钥加密后的密码',
  })
  encryptPwd(@Body('pwd') pwd?: string) {
    // 1. 参数校验
    if (!pwd) {
      throw new BadRequestException('缺少参数：pwd');
    }

    try {
      // 2. 调用加密
      const cipher = this.rsaService.encryptData(pwd);
      return { cipher };
    } catch (error) {
      // 3. 捕获并抛出服务器错误
      throw new InternalServerErrorException('密码加密失败，请稍后重试');
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  signIn(@Body() body: LoginUserDto) {
    return this.authService.login(body.username, body.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('loginNoJwt')
  @ApiBody({ type: LoginUserDto })
  signInNoJwt(@Body() body: LoginUserDto) {
    return this.authService.loginNoJwt(body.username, body.password);
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
  @Post('refresh')
  public refresh(@Req() req: AuthorizedRequest) {
    console.log(
      '🚀 ~ file: auth.controller.ts:51 ~ AuthController ~ refresh ~ req:',
      req.user,
    );
    return this.authService.refreshToken(req.user);
  }

  @Public()
  @Post('wecheat')
  public authWeCheat(@Body() body: any): any {
    console.log(
      '🍉 ~ file: auth.controller.ts:66 ~ AuthController ~ authWeCheat ~ body:',
      body,
    );
    return this.authService.authWeCheat(body.code);
  }
}
