import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ks3-stage-workflow')
export class KS3StageWorkflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 1024,
    nullable: false
  })
  name_ru: string;

  @Column({
    length: 1024,
    nullable: false
  })
  name_en: string;

  @Column({
    nullable: true
  })
  previous_stage: number;

  @Column({
    nullable: true
  })
  next_stage: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}