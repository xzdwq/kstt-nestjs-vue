import { UserEntity } from '@src/user/entity/user.entity';
import { KS3StageWorkflow } from '@src/ks/ks3/entity/ks3stageWorkflow.entity';
import { ProjectEntity } from '@src/project/entity/project.entity';
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
    default: 1
  })
  ks3_stage_workflow_id: number;
  @ManyToOne(() => KS3StageWorkflow, stage => stage.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks3_stage_workflow_id' })
  ks3_stage_workflow: KS3StageWorkflow[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}