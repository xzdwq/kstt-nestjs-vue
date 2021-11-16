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

import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity'
import { KS2WorkflowTypeEntity } from '@src/ks/ks2/entity/workflow/ks2_workflow_type.entity';

@Entity('ks2_workflow')
export class KS2WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @OneToMany(() => KS2WorkflowTypeEntity, type => type.ks2_workflow)
  ks2_types: KS2WorkflowTypeEntity[];

  @Column({
    nullable: false,
    default: 1
  })
  status: number;

  @Column({
    length: 255,
    nullable: true,
  })
  last_action_ru: string;

  @Column({
    length: 255,
    nullable: true,
  })
  last_action_en: string;

  @Column({
    length: 50,
    nullable: true,
  })
  code: string;

  @Column({
    nullable: true,
  })
  deadline: Date;

  @Column({
    nullable: false,
    default: 0
  })
  started: boolean;

  @Column({
    nullable: false,
    default: 0
  })
  complete: boolean;

  @Column({
    name: 'ks2_id',
    nullable: true
  })
  ks2_id: number;
  @ManyToOne(() => KS2Entity, ks2 => ks2.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_id' })
  ks2: KS2Entity;

  @Column({
    nullable: false
  })
  ks3_workflow_id: number;

  @Column({
    nullable: false
  })
  ks3_id: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}