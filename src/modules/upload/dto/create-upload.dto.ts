import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadDto {
  @IsString()
  @IsNotEmpty()
  readonly filename: string;
}
