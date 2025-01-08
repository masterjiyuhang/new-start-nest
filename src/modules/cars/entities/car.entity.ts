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
  UNKNOWN = 0,
  AUTO = 1,
  MANUAL = 2,
}
enum FuelType {
  UNKNOWN = 0,
  PETROL = 1,
  DIESEL = 2,
  ELECTRIC = 3,
  HYBRID = 4,
}
@Entity('car')
export class Car extends BaseTime {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 30, comment: '车辆名称' })
  title: string;

  @Column({ length: 30, comment: '上牌城市' })
  city: string;

  @Column({ comment: '年份' })
  years: number;

  @Column({ length: 30, comment: '车辆颜色' })
  color: string;

  @Column({
    type: 'enum',
    enum: TransmissionType,
    default: TransmissionType.UNKNOWN,
    comment: '0:未知 1:自动 2:手动',
  })
  transmission: number;

  @Column({ type: Boolean, comment: '是否事故' })
  is_over_load: boolean;

  @Column({ type: String, comment: '售卖平台名称', default: '大白菜' })
  platform: string;

  @Column({ type: String, comment: '售卖平台Id', default: '1' })
  platform_id: string;

  @Column({ length: 50, unique: true, comment: '车辆车架号' })
  vin: string;

  @Column({ type: 'date', comment: '首次登记日期' })
  registration_date: string;

  @Column({
    type: 'enum',
    enum: FuelType,
    default: FuelType.UNKNOWN,
    comment: '未知 = 0, 汽油 = 1, 柴油 = 2, 电动 = 3,混合动力 = 4',
  })
  fuel_type: string;

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
