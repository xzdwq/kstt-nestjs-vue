import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity';
import { KS2Controller } from '@src/ks/ks2/ks2.controller';
import { KS2Service } from '@src/ks/ks2/ks2.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KS2Entity
    ]),
    NestjsFormDataModule
  ],
  providers: [
    KS2Service
  ],
  controllers: [
    KS2Controller
  ],
})
export class KS2Module {}