import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KS3Entity } from '@ks3/entity/ks3.entity';
import { KS3Controller } from './ks3.controller';
import { KS3Service } from './ks3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KS3Entity
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