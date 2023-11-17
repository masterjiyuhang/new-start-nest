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
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
// import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() body: Record<string, any>) {
    return this.authService.login(body.username, body.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('check')
  // @UseGuards(AuthGuard)
  @UseGuards(JwtAuthGuard)
  public check(@Req() req: any): User {
    return req.user.toResponseObject();
  }
}
