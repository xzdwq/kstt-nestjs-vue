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
    length: 255,
    nullable: false
  })
  full_name: string;

  @Column({
    length: 100,
    nullable: false
  })
  email: string;

  @Column({
    length: 1024,
    nullable: true
  })
  department: string;

  @Column({
    length: 1024,
    nullable: true
  })
  position: string;

  @Column({
    nullable: false,
    default: 1
  })
  role: number;

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