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

import { DefaultWorkflowStageGroupEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group.entity";
import { UserEntity } from '@src/user/entity/user.entity';

@Entity('default_workflow_stage_type_group_user')
export class DefaultWorkflowStageGroupUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false
  })
  stage_id: number;

  @Column({
    nullable: false
  })
  type_id: number;

  @Column({
    nullable: false
  })
  group_id: number;
  @ManyToOne(() => DefaultWorkflowStageGroupEntity, group => group.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  workflow_stage_group: DefaultWorkflowStageGroupEntity[];

  @Column({
    nullable: true
  })
  user_id: number;
  @ManyToOne(() => UserEntity, (user) => user.workflow_group_user)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity[];

  @Column({
    nullable: true
  })
  order_execution_user: number;

  @Column({
    nullable: false
  })
  hierarchy: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}