import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entity/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>
  ){}

  async get(user_id: number, page: number, limit: number): Promise<object> {
    const totalNotRead = await this.notificationRepository
      .createQueryBuilder('notofication')
      .where(`user_id = ${user_id} and status = 0`)
      .getCount();
    const [data, total] = await this.notificationRepository.findAndCount(
      {
        skip: limit * (page - 1),
        take: limit,
        relations: ['user', 'user.group'],
        where: {
          user_id: user_id
        },
        order: {
          status: 'ASC',
          create_at: 'DESC'
        }
      }
    )
    return {
      success: true,
      data: data,
      total: total,
      totalNotRead: totalNotRead
    }
  }

  async setReadNewNotification(user_id: number, notification_id: number, status: number) {
    await this.notificationRepository.update(notification_id,
      {
        status: status,
        update_at: new Date()
      }
    );
    const res = await this.notificationRepository.find({
      where: {
        id: notification_id
      }
    })
    return {
      success: true,
      data: res,
      total: null,
      totalNotRead: null
    }
  }
}
