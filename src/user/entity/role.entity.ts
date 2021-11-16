import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany
} from 'typeorm';

import { UserRoleEntity } from '@src/user/entity/user_role.entity';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 50,
    nullable: false
  })
  code: string;

  @Column({
    length: 50,
    nullable: false
  })
  name_ru: string;

  @Column({
    length: 50,
    nullable: false
  })
  name_en: string;

  @Column({
    length: 255,
    nullable: true
  })
  comment: string;

  @OneToMany(() => UserRoleEntity, (user_role) => user_role.role)
  user_role: UserRoleEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}