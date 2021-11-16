import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { KS2Entity } from "@src/ks/ks2/entity/ks2.entity";

@Entity('ks2_status')
export class KS2StatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({
    length: 50,
    nullable: false,
    unique: true
  })
  code: string;

  @Column({
    length: 50,
    nullable: false,
  })
  name_ru: string;

  @Column({
    length: 50,
    nullable: false,
  })
  name_en: string;

  // @OneToMany(() => KS2Entity, ks2 => ks2.ks2_status)
  // ks2: KS2Entity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}