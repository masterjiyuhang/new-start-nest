import { BaseDTO } from 'src/common/entity/BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission extends BaseDTO {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    length: 150,
  })
  name: string;

  @Column({
    length: 150,
  })
  code: string;

  @Column({
    length: 100,
    nullable: true,
  })
  desc: string;
}
