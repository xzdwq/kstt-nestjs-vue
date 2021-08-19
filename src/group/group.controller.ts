import {
  Controller,
  Get
} from "@nestjs/common";

import { GroupService } from '@src/group/group.service'

@Controller('api')
export class GroupController {
  constructor(
    private groupService: GroupService
  ){}

  @Get('/group')
  async getGroup(): Promise<any> {
    return await this.groupService.findAll()
  }

  @Get('/grouptype')
  async getGroupType(): Promise<any> {
    return await this.groupService.findGroupType()
  }
}