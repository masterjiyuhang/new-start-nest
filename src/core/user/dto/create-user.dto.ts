import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsEmail } from 'class-validator';
import { IsNotBlacklistedDomainConstraint } from 'src/common/customerValidate';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin',
    description: '用户名',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @Length(2, 10, {
    message: '用户名长度必须为2-10之间',
  })
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsNotBlacklistedDomainConstraint()
  readonly email: string;

  @IsNotEmpty()
  @Length(5, 15, {
    message: '密码长度必须为5-15之间',
  })
  readonly password: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: '角色id',
  })
  roleIds: number[] = [3];
}
