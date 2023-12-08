import { UserMembership } from 'src/modules/member/entities/user-membership.entity';
import { Exclude } from 'class-transformer';
import { BaseTime } from 'src/common/entity/BaseEntity';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

@Entity('member')
export class Member extends BaseTime {
  @Exclude()
  @PrimaryGeneratedColumn()
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

  @Exclude()
  @VersionColumn({ comment: '乐观锁' })
  version: number; // 乐观锁

  @Column({
    type: String,
    comment: '会员状态 1:启用 2: 关闭',
    default: '1',
  })
  member_status: string;

  @OneToMany(() => UserMembership, (userMemberShip) => userMemberShip.member)
  @JoinTable({
    name: 'user_membership_relation',
    joinColumn: { name: 'member_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    synchronize: true,
  })
  public userMembership: Array<UserMembership>;
}
