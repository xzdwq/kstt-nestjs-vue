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
  JoinColumn
} from 'typeorm';
import { UserEntity } from '@src/user/entity/user.entity';
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';

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

  @ManyToMany(() => UserEntity, user => user.id, { cascade: true })
  @JoinTable({
    name: 'user_group',
    joinColumn: {
      name: 'group_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    }
  })
  user: UserEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}