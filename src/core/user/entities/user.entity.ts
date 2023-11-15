import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTime } from '../../../common/entity/BaseEntity';

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
}
