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
  async findOnlyGroup() {
    const [data, total] = await this.groupRepository.findAndCount()
    return {
      success: true,
      data: data,
      total: total
    }
  }
  async findAll(): Promise<object> {
    const [data, total] = await this.groupRepository.findAndCount({
      relations: [
        'user',
        'type'
      ]
    })
    return {
      success: true,
      data: data,
      total: total
    }
  }
  async findOne(group_id: number): Promise<object> {
    const data = await this.groupRepository.findOne(group_id)
    return {
      success: true,
      data: data,
      total: 1
    }
  }
}