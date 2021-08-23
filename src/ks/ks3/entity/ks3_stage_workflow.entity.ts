import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { KS3StageWorkflowGroup } from '@src/ks/ks3/entity/ks3_stage_workflow_group.entity';

@Entity('ks3_stage_workflow')
export class KS3StageWorkflow {
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

  @OneToMany(() => KS3StageWorkflowGroup, (wfgroup) => wfgroup.ks3_stage_workflow)
  ks3_stage_workflow_group: KS3StageWorkflowGroup[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}