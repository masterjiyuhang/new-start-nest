import {
  BadRequestException,
  Injectable,
  // NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../user/user.service';
import { Token } from './dto/token.dto';
import { User } from '../user/entities/user.entity';
// import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async login(username: string, password: string): Promise<Token> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      // throw new NotFoundException(`No user found for username: ${username}`);
      throw new BadRequestException(
        `Username/Email/Password is wrong or does not exist. please check it and try again`,
      );
    }

    const passwordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      // throw new BadRequestException('Invalid password');
      throw new BadRequestException(
        `Username/Email/Password is wrong or does not exist. please check it and try again`,
      );
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: number): Promise<User> {
    return this.usersService.findByUserId(userId);
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.usersService.findByUserId(id);
  }

  /**
   * 生成访问令牌和刷新令牌
   *
   * 此方法接受一个包含用户ID的对象，并生成一对令牌：访问令牌和刷新令牌
   * 访问令牌用于验证用户对受保护资源的访问权限，而刷新令牌用于在访问令牌过期时请求新的访问令牌
   *
   * @param payload 包含用户ID的负载对象，用于生成令牌
   * @returns 返回一个包含访问令牌和刷新令牌的对象
   */
  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    const jwtSecret = this.configService.get('jwtSecret');
    return this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '1d', // Set greater than the expiresIn of the access_token
    });
  }

  private generateRefreshToken(payload: { userId: number }): string {
    const jwtRefreshSecret = this.configService.get('jwtRefreshSecret');
    const RefreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: '7d', // Set greater than the expiresIn of the access_token
    });
    return RefreshToken;
  }

  /**
   * 从刷新令牌生成访问令牌
   * @param token 用户的刷新令牌
   * @returns 返回生成的访问令牌
   *
   * 此方法首先使用JWT（Json Web Token）服务验证传入的刷新令牌
   * 验证通过后，从刷新令牌中提取用户ID，然后基于用户ID生成新的访问令牌
   * 如果令牌验证失败，抛出UnauthorizedException异常，指示未经授权的访问尝试
   */
  refreshToken(user: User) {
    try {
      // 验证刷新令牌并提取用户ID
      // const { userId } = this.jwtService.verify(token, {
      //   secret: this.configService.get('jwtRefreshSecret'),
      // });

      // 根据用户ID生成并返回访问令牌
      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      // 如果令牌验证失败，抛出未经授权异常
      throw new UnauthorizedException();
    }
  }

  async authWeCheat(code: string) {
    console.log(process.env.WECHAT_APP_ID);
    console.log(process.env.WECHAT_APP_SECRET);
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.WECHAT_APP_ID}&secret=${process.env.WECHAT_APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
    try {
      const res = await lastValueFrom(this.httpService.get(url));
      // console.log(
      //   '🍉 ~ file: auth.service.ts:126 ~ AuthService ~ authWeCheat ~ res:',
      //   res,
      // );
      const { openid, session_key } = res.data;

      let user = await this.usersService.findByOpenid(openid);

      if (!user) {
        user = await this.usersService.createUserByWeChat({
          openid,
          nickname: '微信用户',
          avatarUrl: '',
        });
      }

      const token = this.generateTokens({
        userId: user.id,
      });
      return {
        ...token,
        openid,
        session_key,
      };
    } catch (error) {
      console.log(
        '🍉 ~ file: auth.service.ts:126 ~ AuthService ~ authWeCheat ~ error:',
        error,
      );
      throw new Error('微信登录失败，请稍后再试');
    }
    // this.httpService.get(url).subscribe(async (res) => {
    //   const { openid, session_key } = res.data;

    //   let user = await this.usersService.findByOpenid(openid);

    //   if (!user) {
    //     user = await this.usersService.createUserByWeChat({
    //       openid,
    //       nickname: '微信用户',
    //       avatarUrl: '',
    //     });
    //   }

    //   const token = this.generateTokens({
    //     userId: user.id,
    //   });
    //   return {
    //     token,
    //     openid,
    //     session_key,
    //   };
    // });
  }
}
