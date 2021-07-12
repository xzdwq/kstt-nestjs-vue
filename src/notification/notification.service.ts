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

  async get(user_id: number): Promise<object> {
    const data = await this.notificationRepository.find(
      {
        relations: ['user'],
        where: {
          user_id: user_id
        },
        order: {
          create_at: 'DESC'
        }
      }
    )
    return data;
  }
}
