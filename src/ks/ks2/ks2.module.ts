import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { KS2Controller } from '@src/ks/ks2/ks2.controller';
import { KS2Service } from '@src/ks/ks2/ks2.service';

@Module({
  imports: [
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