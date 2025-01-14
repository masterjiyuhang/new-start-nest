import { Expose } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { BaseDTO } from 'src/common/entity/BaseEntity';

export class CreatePermissionDto extends BaseDTO {
  @Expose()
  @IsNotEmpty({
    message: '权限名不能为空',
  })
  name: string;

  @Expose()
  @IsNotEmpty({
    message: '权限编码不能为空',
  })
  code: string;

  @Expose()
  @Length(5, 20, {
    message: '描述信息应在5-20字之间',
  })
  desc: string;
}
