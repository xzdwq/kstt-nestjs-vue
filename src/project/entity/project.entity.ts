import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false
  })
  name_ru: string;

  @Column({
    nullable: false
  })
  name_en: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}