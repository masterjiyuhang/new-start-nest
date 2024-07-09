import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { CarType } from 'src/modules/car-type/entities/car-type.entity';

import { BaseTime } from '../../../common/entity/BaseEntity';

enum TransmissionType {
  NORMAL = 0,
  AUTO = 1,
  MANUAL = 2,
}
@Entity('car')
export class Car extends BaseTime {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 30 })
  city: string;

  @Column()
  years: number;

  @Column({ length: 30 })
  color: string;

  @Column({
    type: 'enum',
    enum: TransmissionType,
    comment: '1: 自动， 2: 手动  3:未知',
  })
  transmission: string;

  @Column({ type: Boolean })
  is_over_load: boolean;

  @Column({ type: String, comment: '售卖平台名称' })
  platform: string;

  @Column({ type: String, comment: '售卖平台id' })
  platform_id: string;

  @Column({
    type: Number,
    default: 0,
  })
  @Exclude()
  delete_flag: number;

  @ManyToMany(() => CarType)
  @JoinTable({
    name: 'car_type_relation',
  })
  car_type: CarType[];
}
