import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { KS3StageWorkflow } from '@src/ks/ks3/entity/ks3_stage_workflow.entity';
import { GroupEntity } from '@src/group/entity/group.entity';

@Entity('ks3_stage_workflow_group')
export class KS3StageWorkflowGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: true
  })
  ks3_stage_workflow_id: number;
  @ManyToOne(() => KS3StageWorkflow, (wfstage) => wfstage.ks3_stage_workflow_group)
  @JoinColumn({ name: 'ks3_stage_workflow_id' })
  ks3_stage_workflow: KS3StageWorkflow;

  @Column({
    nullable: true
  })
  group_id: number;
  @ManyToOne(() => GroupEntity, (group) => group.ks3_stage_workflow_group)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
  
  @Column({
    nullable: true
  })
  order_execution_group: number;

  @Column({
    nullable: false
  })
  hierarchy: string;

  @CreateDateColumn()
  create_at: Date

  @UpdateDateColumn()
  update_at: Date
}