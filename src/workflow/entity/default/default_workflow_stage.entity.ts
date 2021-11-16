import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { DefaultWorkflowStageTypeEntity } from "@src/workflow/entity/default/default_workflow_stage_type.entity";

@Entity('default_workflow_stage')
export class DefaultWorkflowStageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 255,
    nullable: false
  })
  code: string;

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
    nullable: false
  })
  hierarchy: string;

  @OneToMany(() => DefaultWorkflowStageTypeEntity, stage_group => stage_group.stage)
  types: DefaultWorkflowStageTypeEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}