import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { UserEntity } from '@src/user/entity/user.entity';
import { UserGroupEntity } from '@src/user/entity/user_group.entity';
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';
import { KS3StageWorkflowGroup } from '@src/ks/ks3/entity/ks3_stage_workflow_group.entity';

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

  @OneToMany(() => UserGroupEntity, (user_group) => user_group.group)
  user_group: UserGroupEntity[];

  @OneToMany(() => KS3StageWorkflowGroup, (wfgroup) => wfgroup.group)
  ks3_stage_workflow_group: KS3StageWorkflowGroup[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}