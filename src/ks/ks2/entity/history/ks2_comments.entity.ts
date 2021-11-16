import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '@src/user/entity/user.entity';
import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity';

@Entity('ks2_comments')
export class KS2CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 255,
    nullable: false
  })
  comment: string;

  @Column({
    nullable: false
  })
  ks2_id: number;
  @ManyToOne(() => KS2Entity, ks2 => ks2.ks2_comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_id' })
  ks2: KS2Entity[];

  @Column({
    nullable: false
  })
  ks2_workflow_id: number;

  @Column({
    length: 255,
    nullable: false
  })
  ks2_group_code: string;

  @Column({
    length: 50,
    nullable: true,
  })
  author_email: string;

  @Column({
    nullable: true
  })
  author_id: number;
  @ManyToOne(() => UserEntity, (user) => user.ks2_comment)
  @JoinColumn({ name: 'author_id' })
  author_comment: UserEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}