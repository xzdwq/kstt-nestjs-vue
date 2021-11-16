import {
  Controller,
  Get,
  UseFilters,
  UseGuards
} from "@nestjs/common";

import { AuthExceptionFilter } from '@src/core/auth-exceptions.filter';
import { AuthenticatedGuard } from "@src/core/guard/authenticated.guard";
import { GroupService } from '@src/group/group.service'

@Controller('api')
@UseFilters(AuthExceptionFilter)
export class GroupController {
  constructor(
    private groupService: GroupService
  ){}

  @UseGuards(AuthenticatedGuard)
  @Get('/group')
  async getGroup(): Promise<any> {
    return await this.groupService.findAll()
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/grouptype')
  async getGroupType(): Promise<any> {
    return await this.groupService.findGroupType()
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/side')
  async getSide(): Promise<any> {
    return await this.groupService.findSide()
  }
}