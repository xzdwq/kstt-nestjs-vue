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

import { DefaultWorkflowStageGroupEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group.entity";
import { DefaultWorkflowStageEntity } from "@src/workflow/entity/default/default_workflow_stage.entity";
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';

@Entity('default_workflow_stage_type')
export class DefaultWorkflowStageTypeEntity {
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
  @ManyToOne(() => DefaultWorkflowStageEntity, stage => stage.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stage_id' })
  stage: DefaultWorkflowStageEntity[];

  @OneToMany(() => DefaultWorkflowStageGroupEntity, stage_group => stage_group.type)
  groups: DefaultWorkflowStageGroupEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}