import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';

import { UserEntity } from '@src/user/entity/user.entity';
import { WorkflowEntity } from '@src/workflow/entity/workflow.entity';
import { ProjectEntity } from '@src/project/entity/project.entity';
import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity';

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
  certificate_number: string;

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
    nullable: false
  })
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity[];

  @Column({
    nullable: false,
    default: 1
  })
  project_id: number;
  @ManyToOne(() => ProjectEntity, project => project.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity[];

  @Column({
    nullable: false,
    unique: true
  })
  workflow_id: number;
  @ManyToOne(() => WorkflowEntity, wf => wf.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workflow_id' })
  workflow: WorkflowEntity[];

  @OneToMany(() => KS2Entity, ks2 => ks2.ks3)
  ks2: KS2Entity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}