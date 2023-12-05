import { Exclude } from 'class-transformer';
import { BaseTime } from 'src/common/entity/BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

@Entity('member')
export class Member extends BaseTime {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: number; // 会员ID

  @Column({ length: 32, comment: '会员名称' })
  member_name: string;

  @Column({ length: 16, comment: '会员编码' })
  member_code: string;

  @Column({ length: 255, comment: '会员描述' })
  member_desc: string;

  @Column({
    type: Number,
    default: 0,
  })
  @Exclude()
  delete_flag: number;

  @VersionColumn({ comment: '乐观锁' })
  version: number; // 乐观锁

  //   @Column({
  //     type: 'string',
  //     enum: { '1': '启用', '2': '关闭' },
  //     comment: '会员状态 1:启用 2: 关闭',
  //   })
  //   member_status: string;

  //   @Column({ type: 'timestamp', nullable: true, comment: '会员服务开始时间' })
  //   service_start_time: Date;

  //   @Column({ type: 'timestamp', nullable: true, comment: '会员服务结束时间' })
  //   service_end_time: Date;
}
