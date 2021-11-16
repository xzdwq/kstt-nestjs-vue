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

@Entity('ks2_total_sum_incl')
export class KS2TotalSUMInclEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  // строительные работы/construction works
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  construction_works: number;

  // монтажные работы/installation works
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  installation_works: number;

  // оборудование/equipment
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  equipment: number;

  // прочие работы и затраты/other works and costs
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  other_works_costs: number;

  // накладные расходы и прибыль (25% от ПЗ)/Overheads and profit (25 % from DC)
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  overheads_profit: number;

  // Итого по акту с учетом НР и СП/Total on certificate considering Overheads and Estimated Profit
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  total_act_OEP: number;

  // Оплата непредвиденных расходов и затрат, связанных с реализацией рисков Подрядчика / Contractor Risk Fee
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  contractor_risk: number;

  // Итого по акту / Total on certificate
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  total_act: number;

  // Итого по акту с учетом понижающего коэффициента 0,9318 / Certificate total with reduction coefficient 0,9318
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  act_total_reduction_coefficient: number;

  // НДС 18% в соответствии с законодательством Турецкой Республики/VAT 18 % in accordance with the Law of Turkish Republic
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  vat_turkish: number;

  // Итого по акту к оплате с учетом НДС 18%/Total on Certificate to be paid considering VAT 18 %
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true
  })
  total_certificate_paid: number;

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