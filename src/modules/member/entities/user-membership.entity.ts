import { User } from 'src/core/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity('user_member_relation')
export class UserMembership {
  @PrimaryGeneratedColumn({
    comment: '主键ID',
  })
  public id: number;

  @Column({
    name: 'user_id',
    comment: '用户ID',
  })
  public userId: number;

  @Column({
    name: 'member_id',
    comment: '会员ID',
  })
  public memberId: number;

  @Column()
  public order: number;

  @Column({ type: 'timestamp', nullable: true, comment: '会员服务开始时间' })
  service_start_time: Date;

  @Column({ type: 'timestamp', nullable: true, comment: '会员服务结束时间' })
  service_end_time: Date;

  @ManyToOne(() => User, (user) => user.userMembership)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Member, (member) => member.userMembership)
  @JoinColumn({
    name: 'member_id',
  })
  member: Member;
}
