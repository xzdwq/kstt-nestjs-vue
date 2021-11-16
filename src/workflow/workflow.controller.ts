import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards
} from "@nestjs/common";

import { AuthExceptionFilter } from '@src/core/auth-exceptions.filter';
import { AuthenticatedGuard } from "@src/core/guard/authenticated.guard";
import { WorkflowService } from '@src/workflow/workflow.service';
import { Roles } from "@src/core/guard/roles.decorator";
import { RolesGuard } from "@src/core/guard/roles.guard";

@Controller('api')
@UseFilters(AuthExceptionFilter)
export class WorkflowController {
  constructor(
    private workflowService: WorkflowService
  ){}

  // Маршрут согласования по умолчанию
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'editor', 'manager')
  @Get('/defaultworkflow')
  async getDefaultWorkflow() {
    return await this.workflowService.getDefaultWorkflow()
  }

  // Сортировка маршрута по умолчанию
  @UseGuards(AuthenticatedGuard)
  @Post('/sortdefaultworkflowelement')
  async setSortWorkflowElement(@Body() body: Object) {
    return this.workflowService.setSortDefaultWorkflowElement(body)
  }

  // Добавление/удаление групп в стадии по умолчанию
  @UseGuards(AuthenticatedGuard)
  @Post('defaultworkflow/stagegroup')
  async editGroupInStage(
    @Body() body
  ) {
    const params = body.params
    return this.workflowService.editGroupInStage(params)
  }

  // Добавление/удаление групп в стадии
  @UseGuards(AuthenticatedGuard)
  @Post('workflow/stagegroup')
  async editWFGroupInStage(
    @Body() body
  ) {
    const params = body.params
    return this.workflowService.editWFGroupInStage(params)
  }

  // Обновление типа группы
  @UseGuards(AuthenticatedGuard)
  @Put('defaultworkflow/grouptype')
  async updateGroupType(
    @Body('params') params
  ): Promise<any> {
    return await this.workflowService.updateGroupType(params)
  }

  // Обновление типа
  @UseGuards(AuthenticatedGuard)
  @Put('workflow/type')
  async updateType(
    @Body('params') params
  ): Promise<any> {
    return await this.workflowService.updateType(params)
  }

  // Пользователи в группе
  @UseGuards(AuthenticatedGuard)
  @Get('defaultworkflow/useringroup/:id')
  async getUserInGroup(
    @Param() params
  ) {
    return await this.workflowService.getUserInGroup(params.id)
  }

  // Пользователи в группе WF
  @UseGuards(AuthenticatedGuard)
  @Get('workflow/useringroup/:id')
  async getUserInGroupWF(
    @Param() params
  ) {
    return await this.workflowService.getUserInGroupWF(params.id)
  }

  // Поиск пользователя в ADFS
  @UseGuards(AuthenticatedGuard)
  @Get('defaultworkflow/userfound')
  async searchUserADFS(
    @Query('_query') query: string
  ): Promise<any> {
    return await this.workflowService.searchUserADFS(query)
  }

  // Добавление пользователя в группу
  @UseGuards(AuthenticatedGuard)
  @Post('workflow/addusergroup')
  async addUserInGroup(
    @Body() body
  ) {
    const params = body.params
    return this.workflowService.addUserInGroup(params)
  }

  // Добавление пользователя в группу WF
  @UseGuards(AuthenticatedGuard)
  @Post('workflow/addusergroupworkflow')
  async addUserInGroupWF(
    @Body() body
  ) {
    const params = body.params
    return this.workflowService.addUserInGroupWF(params)
  }

  // Удаление пользователя из группы
  @UseGuards(AuthenticatedGuard)
  @Delete('workflow/delusergroup')
  async delUserInGroup(
    @Query('_workflow_id') workflow_id: number,
    @Query('_stage_id') stage_id: number,
    @Query('_group_code') group_code: string,
    @Query('_group_id') group_id: number,
    @Query('_user_id') user_id: number,
    @Query('_user_orig_id') user_orig_id: number
  ) {
    const params = {
      workflow_id: workflow_id,
      stage_id: stage_id,
      group_code: group_code,
      group_id: group_id,
      user_id: user_id,
      user_orig_id: user_orig_id
    }
    return await this.workflowService.delUserInGroup(params)
  }

  // Удаление пользователя из группы WF
  @UseGuards(AuthenticatedGuard)
  @Delete('workflow/delusergroupworkflow')
  async delUserInGroupWF(
    @Query('_workflow_id') workflow_id: number,
    @Query('_stage_id') stage_id: number,
    @Query('_group_code') group_code: string,
    @Query('_group_id') group_id: number,
    @Query('_user_id') user_id: number
  ) {
    const params = {
      workflow_id: workflow_id,
      stage_id: stage_id,
      group_code: group_code,
      group_id: group_id,
      user_id: user_id
    }
    return await this.workflowService.delUserInGroupWF(params)
  }

  // Создание новой группы
  @UseGuards(AuthenticatedGuard)
  @Post('creategroup')
  async createGroup(
    @Body() body
  ) {
    return await this.workflowService.createGroup(body)
  }

  // Удаление группы
  @UseGuards(AuthenticatedGuard)
  @Post('deletegroup')
  async deleteGroup(
    @Body() body
  ) {
    return await this.workflowService.deleteGroup(body)
  }
}