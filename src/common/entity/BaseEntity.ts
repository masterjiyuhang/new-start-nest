import { Exclude, Transform } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseTime extends BaseEntity {
  @Exclude()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  create_time: Date;

  // 在将对象转换为纯对象时应用转换函数。通过将转换函数设置为 () => undefined， updateTime 属性将在转换时被排除。
  @Transform(() => undefined, { toPlainOnly: true })
  @Exclude()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  update_time: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp', nullable: false })
  delete_time: Date;
}

export abstract class BaseDTO extends BaseTime {
  @Exclude()
  @Column({
    type: String,
    comment: '创建人ID',
  })
  creator_id: string;

  @Exclude()
  @Column({
    type: String,
    comment: '操作人ID',
  })
  operator_id: string;

  @Exclude()
  @Column({
    type: Number,
    default: 0,
    comment: '0: 正常, 1: 已删除',
  })
  delete_flag: number;
}

export class DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
