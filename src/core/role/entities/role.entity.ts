import { BaseTime } from 'src/common/entity/BaseEntity';
import { Permission } from 'src/core/permission/entities/permission.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role extends BaseTime {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 32,
  })
  code: string;

  @Column({
    length: 20,
  })
  desc: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission_relation',
  })
  permissions: Permission[];
}
