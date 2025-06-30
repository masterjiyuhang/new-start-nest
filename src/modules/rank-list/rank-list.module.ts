import { Module } from '@nestjs/common';
import { RankListService } from './rank-list.service';
import { RankListController } from './rank-list.controller';

@Module({
  controllers: [RankListController],
  providers: [RankListService],
})
export class RankListModule {}
