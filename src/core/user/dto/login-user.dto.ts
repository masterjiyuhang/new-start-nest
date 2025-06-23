import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: '输入用户名',
    default: 'superAdmin',
  })
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '输入用户密码',
    default: 'admin@123',
  })
  readonly password: string;
}
