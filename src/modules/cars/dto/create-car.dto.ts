import {
  IsBoolean,
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

  @IsString()
  @IsNotEmpty()
  readonly transmission: string;

  @IsBoolean()
  @IsOptional()
  readonly is_over_load: boolean = false;
}
