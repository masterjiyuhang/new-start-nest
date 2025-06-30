import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import {
  RankListService,
  RankPeriod,
  RankPeriodAlias,
} from './rank-list.service';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { Request } from 'express';
import { User } from '@/core/user/entities/user.entity';

@ApiBearerAuth()
@ApiTags('RankList')
@Controller('rankList')
export class RankListController {
  constructor(private readonly rankListService: RankListService) {}

  @ApiOperation({ summary: '获取排行榜信息' })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: RankPeriod,
    description: '时间段',
    example: RankPeriod.WEEKLY,
  })
  @Public()
  @Get('list')
  getRankList(
    @Query('period') period: RankPeriodAlias = RankPeriod.WEEKLY,
    @Req() req: Request,
  ) {
    return this.rankListService.getRankList(period, req);
  }

  @Post('addRank')
  async testAddRank(@Req() req) {
    const user = req.user as User;
    return this.rankListService.userFinishGame(user.id, user.username);
  }
}
