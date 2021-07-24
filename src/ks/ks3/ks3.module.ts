import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity';
import { KS3Controller } from '@src/ks/ks3/ks3.controller';
import { KS3Service } from '@src/ks/ks3/ks3.service';
import { KS3StageWorkflow } from '@src/ks/ks3/entity/ks3stageWorkflow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KS3Entity,
      KS3StageWorkflow
    ])
  ],
  providers: [
    KS3Service
  ],
  controllers: [
    KS3Controller
  ],
})
export class KS3Module {}