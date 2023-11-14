import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CrateCarDto {
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @IsString()
  readonly name: string;

  @IsInt()
  readonly years: number;

  @IsString()
  readonly color: string;

  @IsBoolean()
  @IsOptional()
  readonly isOverload: boolean = false;
}
