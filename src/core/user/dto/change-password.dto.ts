import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: '输入用户名',
    default: 'admin',
  })
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '输入用户密码',
    default: '123456',
  })
  readonly password: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '输入用户密码',
    default: '123456',
  })
  readonly newPassword: string;
}
