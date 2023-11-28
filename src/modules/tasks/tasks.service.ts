import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  handleCron2() {
    this.logger.debug('Called when the current hour is 12');
  }

  // 要声明一个以一定间隔运行的方法，使用@Interval()装饰器前缀
  @Interval(60000 * 5)
  handleInterval() {
    this.logger.debug('每间隔 5 m 执行');
  }

  // 要声明一个在指定时间后运行（一次）的方法，使用@Timeout()装饰器前缀。
  @Timeout(50000)
  handleTimeout() {
    this.logger.debug('Called once after 50 seconds');
  }

  @Cron('*/6 * * * * *', {
    name: 'sixCron',
  })
  triggerNotifications() {
    this.logger.debug('six cron 每6s执行一次～');
  }
}
