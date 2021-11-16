import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity'
import { UserEntity } from '@src/user/entity/user.entity';
import { FileTypeEntity } from '@src/file/entity/file_type.entity';

// Архив всех файлов (и excel и pdf) всех версий карточек КС-2
@Entity('ks2_file_archive')
export class KS2FileArchiveEntity {
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
    nullable: false,
    default: 1
  })
  actual: boolean;

  @Column({
    nullable: false
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
    nullable: false
  })
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    nullable: false
  })
  file_type_id: number;
  @ManyToOne(() => FileTypeEntity, user => user.id)
  @JoinColumn({ name: 'file_type_id' })
  file_type: FileTypeEntity;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: true
  })
  event_ru: string

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: true
  })
  event_en: string

  @Column({
    type: 'uuid',
    nullable: true
  })
  update_uuid: string

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}