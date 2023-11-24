import { IsNotEmpty, Length } from 'class-validator';

export class CreateCarTypeDto {
  @IsNotEmpty({
    message: '车辆类型名称不能为空',
  })
  car_type_name: string;

  @IsNotEmpty({
    message: '车辆类型编码不能为空',
  })
  car_type_code: string;

  @Length(1, 200, {
    message: '描述应在1～200位',
  })
  car_type_desc: string;
}
