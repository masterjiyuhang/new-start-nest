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
  @Length(5, 20, {
    message: '描述信息应在5-20字之间',
  })
  desc: string;
}
