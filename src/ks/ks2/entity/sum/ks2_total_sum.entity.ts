import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity'

@Entity('ks2_total_sum')
export class KS2TotalSUMEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  // Общая/ Total
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  total: number;

  // Основная зарплата/ Basic salary
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  basic_salary: number;

  // Эксплуатация машин/ Operation of mechanisms
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  operation_mechanisms: number;

  // Зарплата машинистов/Salary of mechanics
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  salary_mechanics: number;

  // Материалы/ Materials
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  materials: number;

  // Трудозатраты рабочих, чел.-ч/ Workers labour effort, manhour
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  labor_workers: number;

  // Трудозатраты машинистов, чел.-ч/ perators labour effort, manhour
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  labor_mechanics: number;

  @Column({
    nullable: false
  })
  ks2_id: number;
  @ManyToOne(() => KS2Entity, ks2 => ks2.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_id' })
  ks2: KS2Entity;

  @Column({
    nullable: true
  })
  ks3_id: number;

  @Column({
    nullable: true
  })
  ks3_workflow_id: number;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}