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

import { DefaultWorkflowStageEntity } from "@src/workflow/entity/default/default_workflow_stage.entity";
import { GroupEntity } from '@src/group/entity/group.entity';
import { DefaultWorkflowStageGroupUserEntity } from "@src/workflow/entity/default/default_workflow_stage_group_user.entity";

@Entity('default_workflow_stage_group')
export class DefaultWorkflowStageGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: true
  })
  order_execution_group: number;

  @Column({
    nullable: false
  })
  hierarchy: string;

  @Column({
    nullable: false
  })
  stage_id: number;
  @ManyToOne(() => DefaultWorkflowStageEntity, stage => stage.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stage_id' })
  stage: DefaultWorkflowStageEntity[];

  @Column({
    nullable: true
  })
  group_id: number;
  @ManyToOne(() => GroupEntity, (group) => group.default_workflow_group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity[];

  @OneToMany(() => DefaultWorkflowStageGroupUserEntity, user => user.workflow_stage_group, { onDelete: 'CASCADE' })
  users: DefaultWorkflowStageGroupUserEntity[];

  @CreateDateColumn()
  create_at: Date

  @UpdateDateColumn()
  update_at: Date
}