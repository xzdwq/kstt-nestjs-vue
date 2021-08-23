import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { UserEntity } from '@src/user/entity/user.entity';
import { GroupEntity } from '@src/group/entity/group.entity';

@Entity('user_group')
export class UserGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: true
  })
  user_id: number;
  @ManyToOne(() => UserEntity, (user) => user.user_group)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    nullable: true
  })
  group_id: number;
  @ManyToOne(() => GroupEntity, (group) => group.user_group)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;

  @Column({
    nullable: true
  })
  order_execution_user: number;

  @Column({
    nullable: false
  })
  hierarchy: string;

  @Column({
    nullable: false,
    default: 1
  })
  active: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}