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

import { DefaultWorkflowStageTypeEntity } from "@src/workflow/entity/default/default_workflow_stage_type.entity";
import { GroupEntity } from '@src/group/entity/group.entity';
import { DefaultWorkflowStageGroupUserEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group_user.entity";
import { SideEntity } from '@src/group/entity/side.entity';

@Entity('default_workflow_stage_type_group')
export class DefaultWorkflowStageGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

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
  @ManyToOne(() => DefaultWorkflowStageTypeEntity, type => type.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: DefaultWorkflowStageTypeEntity[];

  @Column({
    nullable: false
  })
  side_id: number;
  @ManyToOne(() => SideEntity, side => side.id)
  @JoinColumn({ name: 'side_id' })
  side: SideEntity[];

  @Column({
    nullable: true
  })
  group_id: number;
  @ManyToOne(() => GroupEntity, (group) => group.default_workflow_group)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity[];

  @OneToMany(() => DefaultWorkflowStageGroupUserEntity, user => user.workflow_stage_group, { onDelete: 'CASCADE' })
  users: DefaultWorkflowStageGroupUserEntity[];

  @CreateDateColumn()
  create_at: Date

  @UpdateDateColumn()
  update_at: Date
}