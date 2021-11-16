import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '@src/notification/entity/notification.entity';
import { NotificationController } from '@src/notification/notification.controller'
import { NotificationService } from '@src/notification/notification.service';

import { UserModule } from '@src/user/user.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity
    ]),
    UserModule
  ],
  providers: [
    NotificationService
  ],
  controllers: [
    NotificationController
  ],
  exports: [
    NotificationService
  ]
})
export class NotificationModule {}