import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { UserEntity } from '@src/user/entity/user.entity';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity'

@Entity('ks2')
export class KS2Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;
  
  @Column({
    length: 255,
    nullable: false,
  })
  act_number: string;

  @Column({
    nullable: false,
  })
  act_date: Date;

  @Column({
    length: 255,
    nullable: false,
  })
  document_number: string;

  @Column({
    nullable: false,
  })
  date_preparation: Date

  @Column({
    nullable: false
  })
  reporting_period: Date;

  @Column({
    length: 255,
    nullable: false,
  })
  estimate_number: string;

  @Column({
    nullable: false
  })
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    nullable: false
  })
  ks3_id: number;
  @ManyToOne(() => KS3Entity, ks3 => ks3.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks3_id' })
  ks3: KS3Entity;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}