import { DocumentStatusEntity } from '@src/status/document/entity/document_status.entity';
import { UserEntity } from '@src/user/entity/user.entity';
import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';

@Entity('ks3')
export class KS3Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 255,
    nullable: false,
    unique: true
  })
  document_number: string;

  @Column({
    nullable: false,
  })
  date_preparation: Date

  @Column({
    length: 255,
    nullable: false
  })
  reporting_period: string;

  @Column({
    nullable: false
  })
  status_id: number;
  @ManyToOne(() => DocumentStatusEntity, document_status => document_status.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'status_id' })
  status: DocumentStatusEntity[];

  @Column({
    nullable: false
  })
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity[];

  @Column({
    length: 255,
    nullable: false,
    default: 1
  })
  project: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}