import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { WorkflowStageGroupEntity } from "@src/workflow/entity/workflow_stage_group.entity";

@Entity('workflow_stage_group_user')
export class WorkflowStageGroupUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false,
    default: 0
  })
  signed: boolean;

  @ManyToOne(() => WorkflowStageGroupEntity, group => group.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workflow_stage_group_id' })
  workflow_stage_group: WorkflowStageGroupEntity;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}