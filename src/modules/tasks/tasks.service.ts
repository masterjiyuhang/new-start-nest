import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron2() {
    this.logger.debug('Called when the current second is 10');
  }

  // 要声明一个以一定间隔运行的方法，使用@Interval()装饰器前缀
  @Interval(20000)
  handleInterval() {
    this.logger.debug('每间隔 20 s 执行');
  }

  // 要声明一个在指定时间后运行（一次）的方法，使用@Timeout()装饰器前缀。
  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }

  @Cron('*/6 * * * * *', {
    name: 'sixCron',
  })
  triggerNotifications() {
    this.logger.debug('six cron 每6s执行一次～');
  }
}
