import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { KS2WorkflowTypeEntity } from '@src/ks/ks2/entity/workflow/ks2_workflow_type.entity';
import { KS2WorkflowTypeGroupUserEntity } from '@src/ks/ks2/entity/workflow/ks2_workflow_type_group_user.entity';
import { SideEntity } from '@src/group/entity/side.entity';

@Entity('ks2_workflow_type_group')
export class KS2WorkflowTypeGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
    default: 0
  })
  action: boolean;

  @Column({
    nullable: false,
    default: 0
  })
  complete: boolean;

  @Column({
    nullable: true,
  })
  deadline: Date;

  @Column({
    nullable: false
  })
  ks2_workflow_id: number;

  @Column({
    nullable: true
  })
  order_execution_group: number;

  @Column({
    nullable: false
  })
  hierarchy: string;

  @Column({
    nullable: false
  })
  ks2_type_id: number;
  @ManyToOne(() => KS2WorkflowTypeEntity, type => type.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_type_id' })
  ks2_type: KS2WorkflowTypeEntity[];

  @Column({
    nullable: false
  })
  side_id: number;
  @ManyToOne(() => SideEntity, side => side.id)
  @JoinColumn({ name: 'side_id' })
  side: SideEntity[];

  @OneToMany(() => KS2WorkflowTypeGroupUserEntity, user => user.ks2_group, { onDelete: 'CASCADE' })
  ks2_users: KS2WorkflowTypeGroupUserEntity[];

  @Column({
    nullable: false
  })
  ks3_workflow_id: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}