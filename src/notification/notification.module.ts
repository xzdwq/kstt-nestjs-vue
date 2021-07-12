import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '@src/notification/entity/notification.entity';
import { NotificationController } from '@src/notification/notification.controller'
import { NotificationService } from '@src/notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity
    ])
  ],
  providers: [
    NotificationService
  ],
  controllers: [
    NotificationController
  ],
})
export class NotificationModule {}