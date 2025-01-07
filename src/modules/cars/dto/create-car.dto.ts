import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsInt()
  @IsNotEmpty()
  readonly years: number;

  @IsString()
  @IsNotEmpty()
  readonly color: string;

  @IsInt()
  @IsNotEmpty()
  readonly transmission: number; // 使用数字枚举值代替字符串

  @IsBoolean()
  @IsOptional()
  readonly is_over_load: boolean = false;

  @IsString()
  @IsNotEmpty()
  readonly vin: string; // 车辆车架号

  @IsDateString()
  @IsNotEmpty()
  readonly registration_date: string; // 首次登记日期

  @IsString()
  @IsNotEmpty()
  readonly fuel_type: string; // 燃油类型

  @IsOptional()
  @IsInt({ each: true })
  readonly car_type_ids?: number[]; // 多对多关系中的类型 ID 列表
}
