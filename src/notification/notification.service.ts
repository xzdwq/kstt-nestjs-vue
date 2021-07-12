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
    // const total = await this.notificationRepository
    //   .createQueryBuilder('notofication')
    //   .where(`user_id = ${user_id}`)
    //   .getCount();
    const [data, total] = await this.notificationRepository.findAndCount(
      {
        skip: limit * (page - 1),
        take: limit,
        relations: ['user'],
        where: {
          user_id: user_id
        },
        order: {
          create_at: 'DESC'
        }
      }
    )
    return {
      data: data,
      total: total
    }
  }
}
