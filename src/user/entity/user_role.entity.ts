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
import { RoleEntity } from '@src/user/entity/role.entity';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false
  })
  user_id: number;
  @ManyToOne(() => UserEntity, (user) => user.user_role)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    nullable: false
  })
  role_id: number;
  @ManyToOne(() => RoleEntity, (role) => role.user_role)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}