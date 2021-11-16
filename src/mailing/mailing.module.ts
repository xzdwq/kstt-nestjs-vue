import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailingService } from '@src/mailing/mailing.service';
import { TokenService } from '@src/auth/token/token.service'
import { TokenEntity } from '@src/auth/token/token.entity';
import { MailingEntity } from '@src/mailing/entity/mailing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TokenEntity,
      MailingEntity
    ]),
    HttpModule
  ],
  providers: [
    MailingService,
    TokenService
  ],
  controllers: [
  ],
  exports: [
    MailingService
  ]
})
export class MailingModule {}