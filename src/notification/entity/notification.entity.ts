import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { UserEntity } from '@src/user/entity/user.entity';

@Entity('notification')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 1024,
    nullable: false
  })
  text_ru: string;

  @Column({
    length: 1024,
    nullable: false
  })
  text_en: string;

  @Column({
    length: 255,
    nullable: true,
    default: 'system'
  })
  type: string;

  @Column({
    nullable: false,
    default: 0
  })
  status: number;

  @Column({
    nullable: false
  })
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}