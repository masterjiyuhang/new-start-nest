import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}

export class UpdateUserMemberDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly memberList: string[];
}

export class AddUserMemberDto {
  @IsNotEmpty()
  readonly member_code: string;
}
