import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { KS2WorkflowTypeGroupEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow_type_group.entity";

@Entity('ks2_workflow_type_group_user')
export class KS2WorkflowTypeGroupUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 255,
    nullable: false
  })
  full_name: string;

  @Column({
    length: 100,
    nullable: false
  })
  login: string;

  @Column({
    length: 100,
    nullable: false
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

  @Column({
    nullable: false,
    default: 0
  })
  signed: boolean;

  @Column({
    nullable: false
  })
  ks2_workflow_id: number;

  @Column({
    nullable: false
  })
  ks2_type_id: number;

  @Column({
    nullable: false
  })
  ks2_group_id: number;
  @ManyToOne(() => KS2WorkflowTypeGroupEntity, group => group.ks2_users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_group_id' })
  ks2_group: KS2WorkflowTypeGroupEntity;

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

  @Column({
    nullable: false
  })
  ks3_workflow_id: number;

  @Column({
    nullable: true
  })
  mail_code: number;

  @Column({
    type: 'datetime2',
    nullable: true
  })
  sign_at: Date;

  
  @Column({
    length: 50,
    nullable: true
  })
  creator: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}