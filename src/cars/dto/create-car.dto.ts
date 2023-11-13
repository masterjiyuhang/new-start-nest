import { IsBoolean, IsInt, IsString, IsUUID } from 'class-validator';

export class CrateCarDto {
  @IsUUID()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsInt()
  readonly years: number;

  @IsString()
  readonly color: string;

  @IsBoolean()
  readonly isOverload: boolean;
}
