import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';

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
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('check')
  // @UseGuards(AuthGuard)
  @UseGuards(JwtAuthGuard)
  public check(@Req() req: any): User {
    return req.user.toResponseObject();
  }
}
