import { IsNotEmpty, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({
    message: '角色名称不能为空',
  })
  @Length(1, 10, {
    message: '角色名称应在1～10位',
  })
  name: string;

  @IsNotEmpty({
    message: '角色码不能为空',
  })
  @Length(1, 15, {
    message: '角色码应在1～15位',
  })
  code: string;

  @Length(1, 20, {
    message: '描述应在1～20位',
  })
  desc: string;

  permissionIds: number[] = [];

  menuIds: number[];
}
