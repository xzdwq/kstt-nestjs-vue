import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service: string;

  @Column()
  token: string;

  @Column({ type: 'datetime2' })
  expires: Date;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}