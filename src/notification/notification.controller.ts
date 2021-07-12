import { Controller, Get, Param, Query } from '@nestjs/common';
import { NotificationService } from '@src/notification/notification.service'

@Controller('api/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':user_id')
  async getNotification(
    @Param('user_id') user_id: number,
    @Query('_page') page: number,
    @Query('_limit') limit: number
  ): Promise<any> {
    return await this.notificationService.get(user_id, page, limit);
  }
}
