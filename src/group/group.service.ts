import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '@src/group/entity/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
  ) {}
  async findAll(): Promise<object> {
    const [data, total] = await this.groupRepository.findAndCount()
    return {
      success: true,
      data: data,
      total: total
    }
  }
}