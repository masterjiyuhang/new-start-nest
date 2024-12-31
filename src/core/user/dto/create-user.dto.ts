import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsEmail, IsEnum } from 'class-validator';
import { IsNotBlacklistedDomainConstraint } from 'src/common/customerValidate';
import { roleEnums } from '../../../common/enums/role.enums';

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
  roleIds: number[]; // 默认为普通用户
}

export class CreateAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsEnum(roleEnums)
  readonly role: roleEnums;
}

export class WeChatUserDto {
  @ApiProperty()
  readonly openid: string;

  @ApiProperty()
  readonly nickname: string;

  @ApiProperty()
  readonly avatarUrl: string;

  // @ApiProperty()
  // readonly gender: number;

  // @ApiProperty()
  // readonly country: string;

  // @ApiProperty()
  // readonly province: string;

  // @ApiProperty()
  // readonly city: string;
}

export class DefaultColumnResponse extends CreateUserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly role: roleEnums;
}
