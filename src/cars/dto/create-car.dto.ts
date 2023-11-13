import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CrateCarDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly years: number;

  @IsString()
  readonly color: string;

  @IsBoolean()
  readonly isOverload: boolean;
}
