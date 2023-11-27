import { Exclude, Transform } from 'class-transformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
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
