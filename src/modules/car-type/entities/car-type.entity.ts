import { BaseTime } from 'src/common/entity/BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CarType extends BaseTime {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 20 })
  car_type_name: string;

  @Column({
    length: 32,
  })
  car_type_code: string;

  @Column({
    length: 255,
  })
  car_type_desc: string;

  @Column({
    type: Number,
    default: 0,
  })
  delete_flag: number;
}
