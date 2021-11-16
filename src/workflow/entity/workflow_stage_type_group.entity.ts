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

import { WorkflowStageGroupUserEntity } from '@src/workflow/entity/workflow_stage_type_group_user.entity';
import { WorkflowStageTypeEntity } from '@src/workflow/entity/workflow_stage_type.entity';
import { SideEntity } from '@src/group/entity/side.entity';

@Entity('workflow_stage_type_group')
export class WorkflowStageGroupEntity {
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
    length: 255,
    nullable: false
  })
  name_ru: string;

  @Column({
    length: 255,
    nullable: false
  })
  name_en: string;

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
    nullable: true,
  })
  deadline: Date;

  @Column({
    nullable: false
  })
  workflow_id: number;

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

  @Column({
    nullable: false
  })
  type_id: number;
  @ManyToOne(() => WorkflowStageTypeEntity, type => type.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: WorkflowStageTypeEntity[];
  
  @Column({
    nullable: false
  })
  side_id: number;
  @ManyToOne(() => SideEntity, side => side.id)
  @JoinColumn({ name: 'side_id' })
  side: SideEntity[];

  @OneToMany(() => WorkflowStageGroupUserEntity, user => user.workflow_stage_group, { onDelete: 'CASCADE' })
  users: WorkflowStageGroupUserEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}