import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity'
import { UserEntity } from '@src/user/entity/user.entity';

// КС-6а для карточки КС-2
@Entity('ks2_file_other')
export class KS2FileOtherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true
  })
  uuid: string;

  @Column({
    type: 'nvarchar',
    length: 255
  })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 255
  })
  path: string;

  @Column({
    nullable: true
  })
  size: number;

  @Column({
    type: 'nvarchar',
    length: 10
  })
  ext: string

  @Column({
    nullable: false
  })
  version: number;

  @Column({
    name: 'ks2_id',
    nullable: true
  })
  ks2_id: number;
  @ManyToOne(() => KS2Entity, ks2 => ks2.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_id' })
  ks2: KS2Entity;

  @Column({
    nullable: true
  })
  ks3_id: number;

  @Column({
    nullable: true
  })
  ks3_workflow_id: number;

  @Column({
    type: 'nvarchar',
    length: 255
  })
  mimetype: string

  @Column({
    type: 'uuid',
    nullable: true
  })
  update_uuid: string

  @Column({
    nullable: false
  })
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}