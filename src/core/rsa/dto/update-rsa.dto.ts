import { PartialType } from '@nestjs/mapped-types';
import { CreateRsaDto } from './create-rsa.dto';

export class UpdateRsaDto extends PartialType(CreateRsaDto) {}
