import { PartialType } from '@nestjs/mapped-types';
import { CreateRankListDto } from './create-rank-list.dto';

export class UpdateRankListDto extends PartialType(CreateRankListDto) {}
