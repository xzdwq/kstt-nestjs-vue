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
import { WorkflowEntity } from '@src/workflow/entity/workflow.entity';
import { WorkflowStageGroupEntity } from '@src/workflow/entity/workflow_stage_group.entity';

@Entity('workflow_stage')
export class WorkflowStageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 1024,
    nullable: false
  })
  name_ru: string;

  @Column({
    length: 1024,
    nullable: false
  })
  short_name_ru: string;

  @Column({
    length: 1024,
    nullable: false
  })
  name_en: string;

  @Column({
    length: 1024,
    nullable: false
  })
  short_name_en: string;

  @Column({
    nullable: true
  })
  previous_stage: number;

  @Column({
    nullable: true
  })
  next_stage: number;

  @Column({
    nullable: true
  })
  order_execution_stage: number;

  @Column({
    nullable: false,
    default: 0
  })
  action: boolean;

  @Column({
    nullable: false,
    default: 0
  })
  complete: boolean;

  @Column({
    nullable: false
  })
  workflow_id: number;
  @ManyToOne(() => WorkflowEntity, wf => wf.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workflow_id' })
  workflow: WorkflowEntity[];

  @OneToMany(() => WorkflowStageGroupEntity, stage_group => stage_group.stage)
  group: WorkflowStageGroupEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}