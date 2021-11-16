import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('file_type')
export class FileTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 50,
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
    length: 255,
    nullable: true
  })
  description_ru: string;

  @Column({
    length: 255,
    nullable: true
  })
  description_en: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}