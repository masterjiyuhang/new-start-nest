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

  @Column({ length: 30 })
  username: string; //用户名

  @Column({ length: 25 })
  email: string; //邮箱

  @Exclude()
  @Column()
  password: string; //密码

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role_relation',
  })
  roles: Role[];

  @OneToMany(() => UserMembership, (userMemberShip) => userMemberShip.user)
  // @JoinTable({
  //   name: 'user_member_relation',
  //   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'member_id', referencedColumnName: 'id' },
  //   synchronize: true,
  // })
  public userMembership: UserMembership[];

  // 将实体对象转换为纯对象时，排除不想暴露的属性
  toResponseObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
