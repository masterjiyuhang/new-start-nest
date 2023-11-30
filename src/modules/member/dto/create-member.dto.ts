import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  readonly member_name: string;

  @IsString()
  @IsNotEmpty()
  readonly member_code: string;

  @IsOptional()
  @IsString()
  member_desc: string;
}
