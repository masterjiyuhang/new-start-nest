import { IsNotEmpty, Length } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({
    message: '权限名不能为空',
  })
  name: string;

  @Length(5, 20, {
    message: '描述信息应在5-20字之间',
  })
  desc: string;
}
