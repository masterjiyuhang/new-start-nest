import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTime } from '../../../common/entity/BaseEntity';
import { Role } from 'src/core/role/entities/role.entity';
import { Exclude, instanceToPlain } from 'class-transformer';
import { UserMembership } from 'src/modules/member/entities/user-membership.entity';

@Entity('user')
export class User extends BaseTime {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: number; // 标记为主键，值自动生成

  @Column({ length: 255, nullable: true })
  username: string; //用户名

  @Column({ length: 255, nullable: true })
  email: string; //邮箱

  @Exclude()
  @Column({ length: 255, nullable: true })
  password: string; //密码

  @Column({ nullable: true })
  openid: string;

  @Column({ nullable: true }) // 可存储微信昵称，方便后续展示等，初始可为空
  wechatNickname: string;

  @Column({ nullable: true }) // 可存储微信头像链接，初始可为空
  wechatAvatar: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role_relation',
  })
  roles: Role[];

  @OneToMany(() => UserMembership, (userMemberShip) => userMemberShip.user)
  public userMembership: Array<UserMembership>;

  // 将实体对象转换为纯对象时，排除不想暴露的属性
  toResponseObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
