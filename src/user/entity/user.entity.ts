import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { UserGroupEntity } from '@src/user/entity/user_group.entity';
import { DefaultWorkflowStageGroupUserEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group_user.entity";
import { UserRoleEntity } from '@src/user/entity/user_role.entity';
import { KS2HistoryEntity } from "@src/ks/ks2/entity/history/ks2_history.entity";
import { KS2CommentsEntity } from '@src/ks/ks2/entity/history/ks2_comments.entity';

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
  login: string;

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

  @OneToMany(() => UserGroupEntity, (user_group) => user_group.user)
  user_group: UserGroupEntity[];

  @OneToMany(() => UserRoleEntity, (user_role) => user_role.user)
  user_role: UserRoleEntity[];

  @OneToMany(() => DefaultWorkflowStageGroupUserEntity, (wfgroup) => wfgroup.user)
  workflow_group_user: DefaultWorkflowStageGroupUserEntity[];

  @OneToMany(() => KS2HistoryEntity, (h) => h.author)
  ks2_history_author: KS2HistoryEntity[];

  @OneToMany(() => KS2HistoryEntity, (h) => h.answer)
  ks2_history_answer: KS2HistoryEntity[];

  @OneToMany(() => KS2CommentsEntity, (c) => c.author_comment)
  ks2_comment: KS2CommentsEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}