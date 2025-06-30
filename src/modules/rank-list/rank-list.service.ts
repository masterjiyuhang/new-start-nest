import { User } from '@/core/user/entities/user.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import Redis from 'ioredis';

export enum RankPeriod {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export type RankPeriodAlias = 'weekly' | 'monthly' | 'yearly';

@Injectable()
export class RankListService {
  private readonly FINISH_COUNT_KEY = `user:finishCount`;
  private readonly logger = new Logger(RankListService.name);
  private readonly rankKeys = {
    [RankPeriod.WEEKLY]: `${this.FINISH_COUNT_KEY}`,
    [RankPeriod.MONTHLY]: `${this.FINISH_COUNT_KEY}:${RankPeriod.MONTHLY}Rank`,
    [RankPeriod.YEARLY]: `${this.FINISH_COUNT_KEY}:${RankPeriod.YEARLY}Rank`,
  };
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async userFinishGame(userId: number, username: string) {
    const member = `${userId}-${username}`;
    const counts = {};

    for (const period of Object.keys(this.rankKeys)) {
      const rankKey = this.rankKeys[period];

      // 记录操作前的数据状态
      const beforeCount = await this.redis.zscore(rankKey, member);
      this.logger.debug(`[${period}] 操作前 ${member} 的分数: ${beforeCount}`);

      // 执行插入/更新操作
      let count = await this.redis.zscore(rankKey, member);
      if (!count) {
        await this.redis.zadd(rankKey, 1, member);
        this.logger.debug(`[${period}] 新建成员 ${member}，分数: 1`);
      } else {
        await this.redis.zincrby(rankKey, 1, member);
        this.logger.debug(`[${period}] 增加成员 ${member} 分数，+1`);
      }

      // 验证操作后的数据
      count = await this.redis.zscore(rankKey, member);
      counts[period] = count;
      this.logger.debug(`[${period}] 操作后 ${member} 的分数: ${count}`);
    }

    return counts;
  }

  private getUserName(member: string) {
    const list = member.split('-');

    const len = list.length;
    return list[len - 1];
  }

  private translateList(rankList: string[]) {
    const res = [];
    for (let i = 0; i < rankList.length; i += 2) {
      console.log(
        '🍉 ~ rank-list.service.ts:53 ~ RankListService ~ translateList ~ rankList[i]:',
        rankList[i],
      );
      const username = this.getUserName(rankList[i]);
      const count = parseInt(rankList[i + 1] ?? '-1');
      res.push({ username, count });
    }
    return res;
  }

  async getRankList(period: RankPeriodAlias = RankPeriod.WEEKLY, req: Request) {
    console.log(
      '🍉 ~ rank-list.service.ts:58 ~ RankListService ~ getRankList ~ req:',
      req.user,
    );

    const user = req.user as User;

    let self = null;
    const rankPeriod = this.rankKeys[period];
    const rankList = await this.redis.zrevrange(
      rankPeriod,
      0,
      24,
      'WITHSCORES',
    );
    if (user) {
      const member = `${user.id}-${user.username}`;
      const userRank = await this.redis.zrevrank(rankPeriod, member);
      const userCount = await this.redis.zscore(rankPeriod, member);
      self = {
        username: user.username,
        count: userCount === null ? -1 : parseInt(userCount),
        rank: userRank === null ? -1 : userRank + 1,
      };
    }

    return {
      self,
      list: this.translateList(rankList),
    };
  }

  async resetRankList(period: RankPeriodAlias = RankPeriod.WEEKLY) {
    const rankKey = this.rankKeys[period];
    try {
      await this.redis.del(rankKey);
      this.logger.verbose(`${period}重置排行榜成功: ${new Date()}`);
    } catch (error) {
      this.logger.error(`${period}重置排行榜时发生错误: ${error}`);
    }
  }
}
