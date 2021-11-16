import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';

@Entity('workflow')
export class WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @OneToMany(() => WorkflowStageEntity, stage => stage.workflow, { onDelete: 'CASCADE' })
  stage: WorkflowStageEntity[];

  @Column({
    nullable: false,
    default: 1
  })
  current_stage: number;

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

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}