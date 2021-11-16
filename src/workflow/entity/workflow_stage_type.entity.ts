import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { WorkflowStageGroupEntity } from "@src/workflow/entity/workflow_stage_type_group.entity";
import { WorkflowStageEntity } from "@src/workflow/entity/workflow_stage.entity";
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';

@Entity('workflow_stage_type')
export class WorkflowStageTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: true
  })
  order_execution_type: number;

  @Column({
    nullable: false
  })
  hierarchy: string;

  @Column({
    nullable: false
  })
  workflow_id: number;

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
    nullable: false,
    default: 1
  })
  type_id: number;
  @ManyToOne(() => GroupTypeEntity, group_type => group_type.id)
  @JoinColumn({ name: 'type_id' })
  type: GroupTypeEntity;

  @Column({
    nullable: false
  })
  stage_id: number;
  @ManyToOne(() => WorkflowStageEntity, stage => stage.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stage_id' })
  stage: WorkflowStageEntity[];

  @OneToMany(() => WorkflowStageGroupEntity, stage_group => stage_group.type, { onDelete: 'CASCADE' })
  groups: WorkflowStageGroupEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}