import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('mailing')
export class MailingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: true
  })
  message_code: number;

  @Column({
    length: 1024,
    nullable: true,
  })
  list_emails: string;

  @Column({
    length: 1024,
    nullable: true,
  })
  theme: string;

  @Column({
    nullable: true
  })
  ks2_id: number;

  @Column({
    nullable: true
  })
  ks3_id: number;

  @Column({
    nullable: true
  })
  ks2_workflow_id: number;

  @Column({
    nullable: true
  })
  ks3_workflow_id: number;

  @Column({
    length: 50,
    nullable: true,
  })
  author_email: string;

  @Column({
    length: 255,
    nullable: true,
  })
  etc: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}