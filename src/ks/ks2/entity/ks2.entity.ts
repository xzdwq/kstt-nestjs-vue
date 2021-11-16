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

import { UserEntity } from '@src/user/entity/user.entity';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity'
import { KS2FileArchiveEntity } from '@src/ks/ks2/entity/file/ks2_file_archive.entity'
import { KS2FileExcelEntity } from '@src/ks/ks2/entity/file/ks2_file_excel.entity'
import { KS6aFilePdfEntity } from '@src/ks/ks2/entity/file/ks6a_file_pdf.entity'
import { KS2TotalSUMEntity } from '@src/ks/ks2/entity/sum/ks2_total_sum.entity'
import { KS2TotalSUMInclEntity } from "@src/ks/ks2/entity/sum/ks2_total_sum_incl.entity"
import { KS2WorkflowEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow.entity";
import { KS2FileOtherEntity } from "@src/ks/ks2/entity/file/ks2_file_other.entity";
import { KS2StatusEntity } from "@src/ks/ks2/entity/ks2_status.entity";
import { KS2FilePdfEntity } from "@src/ks/ks2/entity/file/ks2_file_pdf.entity";
import { KS2HistoryEntity } from "@src/ks/ks2/entity/history/ks2_history.entity";
import { KS2CommentsEntity } from "@src/ks/ks2/entity/history/ks2_comments.entity";

@Entity('ks2')
export class KS2Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  // Договор подряда 
  @Column({
    length: 255,
    nullable: false,
  })
  subcontract_number: string;
  // Дата подряда
  @Column({
    nullable: false,
  })
  subcontract_date: Date;
  // Номер документа
  @Column({
    length: 255,
    nullable: false,
  })
  document_number: string;
  // Дата составления
  @Column({
    nullable: false,
  })
  date_preparation: Date
  // Отчетный период 
  @Column({
    nullable: false
  })
  reporting_period: Date;
  // Номер сметы
  @Column({
    length: 255,
    nullable: false,
  })
  estimate_number: string;
  // Локальный номер сметы
  @Column({
    length: 50,
    nullable: true,
  })
  estimate_local_number: string;
  // ККС
  @Column({
    length: 50,
    nullable: true,
  })
  kks: string;
  // Ревизия
  @Column({
    length: 50,
    nullable: true,
  })
  revision: string;
  // Код здания
  @Column({
    length: 50,
    nullable: true,
  })
  building_code: string;

  @Column({
    nullable: false
  })
  user_id: number;
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    nullable: false
  })
  ks3_id: number;
  @ManyToOne(() => KS3Entity, ks3 => ks3.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks3_id' })
  ks3: KS3Entity;

  @OneToMany(() => KS2FileArchiveEntity, ks2 => ks2.ks2)
  ks2_file_archive: KS2FileArchiveEntity[];

  @OneToOne(() => KS2FileExcelEntity, ks2 => ks2.ks2, { onDelete: 'CASCADE' })
  ks2_file_excel: KS2FileExcelEntity;

  @OneToOne(() => KS6aFilePdfEntity, ks6a => ks6a.ks2, { onDelete: 'CASCADE' })
  ks6a_file_pdf: KS6aFilePdfEntity;

  @OneToOne(() => KS2FilePdfEntity, ks2 => ks2.ks2, { onDelete: 'CASCADE' })
  ks2_file_pdf: KS2FilePdfEntity;

  @OneToMany(() => KS2TotalSUMEntity, ks2 => ks2.ks2)
  ks2_total_sum: KS2TotalSUMEntity[];

  @OneToMany(() => KS2TotalSUMInclEntity, ks2 => ks2.ks2)
  ks2_total_sum_incl: KS2TotalSUMInclEntity[];

  @OneToMany(() => KS2WorkflowEntity, ks2 => ks2.ks2, { onDelete: 'CASCADE' })
  ks2_workflow: KS2WorkflowEntity[];

  @OneToMany(() => KS2FileOtherEntity, ks2 => ks2.ks2)
  ks2_file_other: KS2FileOtherEntity[];

  @OneToMany(() => KS2HistoryEntity, ks2 => ks2.ks2)
  ks2_history: KS2HistoryEntity[];

  @Column({
    nullable: false
  })
  ks2_status_id: number;
  @ManyToOne(() => KS2StatusEntity, ks2_status => ks2_status.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ks2_status_id' })
  ks2_status: KS2StatusEntity;

  @OneToMany(() => KS2CommentsEntity, comment => comment.ks2, { onDelete: 'CASCADE' })
  ks2_comment: KS2CommentsEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}