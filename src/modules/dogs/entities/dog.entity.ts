import { Exclude } from 'class-transformer';
import { BaseTime } from 'src/common/entity/BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dog')
export class Dog extends BaseTime {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 30 })
  name: string;

  @Column()
  age: number;

  @Column({ length: 30 })
  breed: string;
}
