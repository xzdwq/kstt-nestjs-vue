import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';

import { UserGroupEntity } from '@src/user/entity/user_group.entity';
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';
import { DefaultWorkflowStageGroupEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group.entity";
import { SideEntity } from '@src/group/entity/side.entity';

@Entity('group')
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 255,
    unique: true,
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
  @ManyToOne(() => GroupTypeEntity, group_type => group_type.id)
  @JoinColumn({ name: 'type_id' })
  type: GroupTypeEntity;

  @Column({
    nullable: false,
    default: 1
  })
  side_id: number;
  @ManyToOne(() => SideEntity, side => side.id)
  @JoinColumn({ name: 'side_id' })
  side: SideEntity;

  @OneToMany(() => UserGroupEntity, (user_group) => user_group.group)
  user_group: UserGroupEntity[];

  @OneToMany(() => DefaultWorkflowStageGroupEntity, (wfgroup) => wfgroup.group)
  default_workflow_group: DefaultWorkflowStageGroupEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}