import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: '输入用户名',
    default: 'erhang',
  })
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '输入用户密码',
    default: '123456',
  })
  readonly password: string;
}
