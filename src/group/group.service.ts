import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from '@src/group/entity/group.entity';
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';
import { SideEntity } from '@src/group/entity/side.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupTypeEntity)
    private groupTypeRepository: Repository<GroupTypeEntity>,
    @InjectRepository(SideEntity)
    private sideRepository: Repository<SideEntity>,
  ) {}

  async findGroupByCode(code) {
    const data = await this.groupRepository.findOne({
      where: {
        code: code
      }
    })
    return data
  }

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
        'user_group',
        'user_group.user',
        'type',
        'side'
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
  // Типы групп
  async findGroupType() {
    const [data, total] = await this.groupTypeRepository.findAndCount()
    return {
      success: true,
      data: data,
      total: total
    }
  }

  async onUpdateGroupType(params) {
    const group_id = params.group_id,
          group_type = params.group_type;
    let result;
    const group: any = await this.groupRepository.findOne(group_id)
    if(group.type_id != group_type) {
      group.type_id = group_type
      result = await this.groupRepository.save(group)
    } else {
      result = group
    }
    return result
  }

  async findSide() {
    const [data, total] = await this.sideRepository.findAndCount()
    return {
      success: true,
      data: data,
      total: total
    }
  }
}