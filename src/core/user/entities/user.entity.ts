import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTime } from '../../../common/entity/BaseEntity';
import { Role } from 'src/core/role/entities/role.entity';

@Entity('user')
export class User extends BaseTime {
  @PrimaryGeneratedColumn('uuid')
  id: number; // 标记为主键，值自动生成

  @Column({ length: 30 })
  username: string; //用户名

  @Column({ length: 15 })
  email: string; //邮箱

  @Column()
  password: string; //密码

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role_relation',
  })
  roles: Role[];
}
