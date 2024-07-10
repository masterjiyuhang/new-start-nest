import { Exclude } from 'class-transformer';
import { BaseDTO } from 'src/common/entity/BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'car_type',
  orderBy: {
    create_time: 'ASC',
  },
})
export class CarType extends BaseDTO {
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
  @Exclude()
  delete_flag: number;
}
