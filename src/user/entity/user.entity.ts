import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

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

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}