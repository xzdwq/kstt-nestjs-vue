import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { KS2WorkflowEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow.entity";
import { KS2WorkflowTypeGroupEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow_type_group.entity";
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';

@Entity('ks2_workflow_type')
export class KS2WorkflowTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: true
  })
  order_execution_type: number;

  @Column({
    nullable: false
  })
  hierarchy: string;

  @Column({
    nullable: false,
    default: 0
  })
  action: boolean;

  @Column({
    nullable: false,
    default: 0
  })
  complete: boolean;

  @Column({
    nullable: false
  })
  ks2_workflow_id: number;
  @ManyToOne(() => KS2WorkflowEntity, stage => stage.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_workflow_id' })
  ks2_workflow: KS2WorkflowEntity[];

  @Column({
    nullable: false,
    default: 1
  })
  type_id: number;
  @ManyToOne(() => GroupTypeEntity, group_type => group_type.id)
  @JoinColumn({ name: 'type_id' })
  type: GroupTypeEntity;

  @Column({
    nullable: false
  })
  ks3_workflow_id: number;

  @OneToMany(() => KS2WorkflowTypeGroupEntity, type_group => type_group.ks2_type)
  ks2_groups: KS2WorkflowTypeGroupEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}