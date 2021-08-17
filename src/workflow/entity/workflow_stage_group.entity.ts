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
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';
import { WorkflowStageGroupUserEntity } from '@src/workflow/entity/workflow_stage_group_user.entity';

@Entity('workflow_stage_group')
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
    default: 1
  })
  type_id: number;
  @ManyToOne(() => GroupTypeEntity, group_type => group_type.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: GroupTypeEntity;

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
    nullable: false
  })
  stage_id: number;
  @ManyToOne(() => WorkflowStageEntity, stage => stage.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stage_id' })
  stage: WorkflowStageEntity[];

  @OneToMany(() => WorkflowStageGroupUserEntity, user => user.workflow_stage_group)
  users: WorkflowStageGroupUserEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}