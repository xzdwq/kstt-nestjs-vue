import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity'
import { UserEntity } from '@src/user/entity/user.entity';

@Entity('ks2_history')
export class KS2HistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false
  })
  ks2_id: number;
  @ManyToOne(() => KS2Entity, ks2 => ks2.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_id' })
  ks2: KS2Entity[];

  @Column({
    length: 250,
    nullable: false,
  })
  text: string;

  @Column({
    length: 50,
    nullable: false,
  })
  author_email: string;

  @Column({
    nullable: true
  })
  user_id: number;
  @ManyToOne(() => UserEntity, (user) => user.ks2_history_author)
  @JoinColumn({ name: 'user_id' })
  author: UserEntity[];

  @Column({
    nullable: false,
  })
  ks2_group_id: number;

  @Column({
    nullable: false,
    default: 1
  })
  type: number;

  @Column({
    nullable: false,
    default: 1
  })
  action: boolean;

  @Column({
    nullable: false,
    default: 0
  })
  complete: boolean;

  @Column({
    length: 250,
    nullable: true,
  })
  answer_text: string;

  @Column({
    length: 50,
    nullable: true,
  })
  answer_email: string;

  @Column({
    nullable: true
  })
  answer_id: number;
  @ManyToOne(() => UserEntity, (user) => user.ks2_history_answer)
  @JoinColumn({ name: 'answer_id' })
  answer: UserEntity[];

  @Column({
    nullable: false
  })
  ks2_workflow_id: number;

  @Column({
    nullable: true
  })
  closed_at: Date;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}