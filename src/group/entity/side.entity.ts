import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated
} from 'typeorm';

@Entity('side')
export class SideEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
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

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}