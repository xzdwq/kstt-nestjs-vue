import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { UserGroupEntity } from '@src/user/entity/user_group.entity';
import { DefaultWorkflowStageGroupUserEntity } from "@src/workflow/entity/default/default_workflow_stage_group_user.entity";

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true
  })
  uuid: string;

  @Column({
    length: 255,
    nullable: false
  })
  full_name: string;

  @Column({
    length: 100,
    nullable: false,
    unique: true
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

  @OneToMany(() => UserGroupEntity, (user_group) => user_group.user)
  user_group: UserGroupEntity[];

  @OneToMany(() => DefaultWorkflowStageGroupUserEntity, (wfgroup) => wfgroup.user)
  workflow_group_user: DefaultWorkflowStageGroupUserEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}