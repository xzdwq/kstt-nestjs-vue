import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Query,
  UseGuards,
  UseFilters
} from '@nestjs/common';

import { AuthExceptionFilter } from '@src/core/auth-exceptions.filter';
import { AuthenticatedGuard } from "@src/core/guard/authenticated.guard";
import { NotificationService } from '@src/notification/notification.service'

@Controller('api/notification')
@UseFilters(AuthExceptionFilter)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getNotification(
    @Request() req,
    @Query('_page') page: number,
    @Query('_limit') limit: number
  ): Promise<any> {
    const user_id = req.user.DB.id
    return await this.notificationService.get(user_id, page, limit);
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async setReadNewNotification(
    @Request() req,
    @Body() params,
  ): Promise<any> {
    const user_id = req.user.DB.id
    const notification_id = params.params.notification_id
    const status = params.params.status
    return await this.notificationService.setReadNewNotification(user_id, notification_id, status)
  }
}
