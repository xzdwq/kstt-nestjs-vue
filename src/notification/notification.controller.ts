import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Post(':user_id')
  async setReadNewNotification(
    @Param('user_id') user_id: number,
    @Body() params,
  ): Promise<any> {
    const notification_id = params.params.notification_id
    const status = params.params.status
    return await this.notificationService.setReadNewNotification(user_id, notification_id, status)
  }
}
