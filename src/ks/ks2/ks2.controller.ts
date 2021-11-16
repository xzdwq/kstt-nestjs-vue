import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  Res,
  UseFilters,
  UseGuards
} from "@nestjs/common";
import { FormDataRequest } from "nestjs-form-data"
import { Response } from 'express';

import { AuthExceptionFilter } from '@src/core/auth-exceptions.filter';
import { AuthenticatedGuard } from "@src/core/guard/authenticated.guard";
import { KS2Service } from '@src/ks/ks2/ks2.service'
import { Roles } from "@src/core/guard/roles.decorator";
import { RolesGuard } from "@src/core/guard/roles.guard";

@Controller('api')
@UseFilters(AuthExceptionFilter)
export class KS2Controller {
  constructor(
    private ks2Service: KS2Service
  ) {}

  // Загрузка Excel формы при создании карточки КС-2 и обновлении версии файла
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('/ks2/excelupload')
  @FormDataRequest()
  async uploadKS2File(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.uploadKS2File(body, author)
  }

  // Загрузка КС-6а PDF формы
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('/ks2/ks6aupload')
  @FormDataRequest()
  async uploadKS6aFile(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.uploadKS6aFile(body, author)
  }

  // Загрузка прочих файлов
  @UseGuards(AuthenticatedGuard)
  @Post('/ks2/otherupload')
  @FormDataRequest()
  async otherUploadFile(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.otherUploadFile(body, author)
  }

  // Список статусов для КС-2
  @UseGuards(AuthenticatedGuard)
  @Get('/ks2/status')
  async getKS2StatusList(): Promise<any>{
    return await this.ks2Service.getKS2StatusList()
  }

  // Списко КС-2 привязанных к id КС-3
  @UseGuards(AuthenticatedGuard)
  @Get('/ks2/:id')
  async getKS2ByKS3Id(
    @Request() req,
    @Param() params,
    @Query('_page') page: number,
    @Query('_limit') limit: number,
    @Query('_sortIndex') sortIndex: string,
    @Query('_sort') sort: string,
    @Query('_filter') filter: string,
    @Query('_searchIndex') searchIndex: string,
    @Query('_search') search: string
  ): Promise<any>{
    params.page = page,
    params.limit = limit,
    params.sortIndex = sortIndex
    params.sort = sort
    params.filter = filter
    params.searchIndex = searchIndex
    params.search = search
    const author = req.user
    return await this.ks2Service.getKS2ByKS3Id(params, author)
  }

  // Конкретный КС-2
  @UseGuards(AuthenticatedGuard)
  @Get('/ks2id/:id')
  async getKS2ById(
    @Request() req,
    @Param() params
  ): Promise<any>{
    const user = req.user
    return await this.ks2Service.getKS2ById(params.id, user)
  }

  // Удаление КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Delete('/ks2/delete')
  async ks2Delete(
    @Query('ks2_id') ks2_id: number,
    @Query('ks3_id') ks3_id: number,
  ) {
    const params = {
      ks2_id: ks2_id,
      ks3_id: ks3_id
    }
    return await this.ks2Service.ks2Delete(params)
  }

  // Удаление списка КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Post('/ks2/multidelete')
  async ks2MultiDelete(
    @Body() body
  ) {
    return await this.ks2Service.ks2MultiDelete(body)
  }

  // Скачать файл из КС-2
  @UseGuards(AuthenticatedGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Get('/ks2/download/:uuid')
  async download(
    @Param('uuid') uuid: number,
    @Res() res: Response
  ) {
    const path = await this.ks2Service.getKS2Path(uuid)
    return res.download(path)
  }

  // Удалить файл из КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Delete('/ks2/deletefile')
  async deleteFile(
    @Query('uuid') uuid: number,
    @Request() req,
  ) {
    const author = req.user
    return await this.ks2Service.deleteFile(uuid, author)
  }

  // Просмотр архива
  @UseGuards(AuthenticatedGuard)
  @Get('/ks2archive/:id')
  async getArchive(
    @Query('_filter') filter: string,
    @Param() params
  ) {
    return await this.ks2Service.getKS2Archive(params.id, filter)
  }

  // Просмотр прочих файлов
  @UseGuards(AuthenticatedGuard)
  @Get('/ks2otherfile/:id')
  async getOtherFile(
    @Param() params
  ) {
    return await this.ks2Service.getOtherFile(params.id)
  }

  // Информация по WF акта КС-2
  @UseGuards(AuthenticatedGuard)
  @Get('/ks2workflow/:id')
  async getWorkflowInfoByKS2Id(
    @Param() params
  ): Promise<any>{
    return await this.ks2Service.getWorkflowInfoByKS2Id(params.id)
  }

  // Сортировка маршрута согласования КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('/ks2workflow/sorted')
  async setSortWorkflowElement(@Body() body: Object) {
    return this.ks2Service.setSortWorkflowElement(body)
  }

  // Добавление/удаление групп в стадии по умолчанию
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('ks2/workflow/cerrectstage')
  async editGroupInStage(
    @Body() body
  ) {
    const params = body.params
    return this.ks2Service.editGroupInStage(params)
  }

  // Изменить тип групп
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('ks2/workflow/updtype')
  async updateType(
    @Body() body
  ) {
    const params = body.params
    return this.ks2Service.updateType(params)
  }

  // Пользователи в группе
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor', 'reader')
  @Get('ks2/workflow/useringroup/:id')
  async getUserInGroup(
    @Param() params
  ) {
    return await this.ks2Service.getUserInGroup(params.id)
  }

  // Добавить пользователя в группу
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('ks2/workflow/addusergroup')
  async addUserGroup(
    @Body() body
  ) {
    const params = body.params
    return this.ks2Service.addUserGroup(params)
  }

  // Удаление пользователя из группы
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Delete('ks2/workflow/delusergroup')
  async delUserInGroup(
    @Query('_ks2_id') workflow_id: number,
    @Query('_group_code') group_code: string,
    @Query('_group_id') group_id: number,
    @Query('_user_id') user_id: number,
  ) {
    const params = {
      workflow_id: workflow_id,
      group_code: group_code,
      group_id: group_id,
      user_id: user_id
    }
    return await this.ks2Service.delUserInGroup(params)
  }

  // Проверка КС-2 перед согласованием
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('ks2/checkapproval')
  async checkSendApproval(
    @Body() body
  ) {
    return await this.ks2Service.checkSendApproval(body)
  }

  // Запуск согласования КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('ks2/startworkflow')
  async startWorkflow(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.startWorkflow(body, author)
  }

  // Проверка КС-2 перед подписанием
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('ks2/checksign')
  async checkSendSign(
    @Body() body
  ) {
    return await this.ks2Service.checkSendSign(body)
  }

  // Предварительная проверка перед подписание КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Post('ks2/checkapprove')
  async checkApprove(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.checkApprove(body, author)
  }

  // Согласование КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Post('ks2/approve')
  async approve(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.approve(body, author)
  }

  // Добавление экстра согласующего в акт КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Post('ks2/addextraapprover')
  async addextraapprover(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.addextraapprover(body, author)
  }

  // Удалить согласующего из списка согласовантов КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Post('ks2/removeexec')
  async removeexec(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.removeexec(body, author)
  }

  // Добавление замечания
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Post('ks2/addremark')
  async addremark(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.addremark(body, author)
  }

  // Закрыть замечание
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor')
  @Post('ks2/eliminatingremark')
  async eliminatingremark(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.eliminatingremark(body, author)
  }

  // Добавить комментарий участника согласования к КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Post('ks2/addcomment')
  async addcomment(
    @Request() req,
    @Body() body
  ) {
    const author = req.user
    return await this.ks2Service.addcomment(body, author)
  }

  // Удалить комментарий участника согласования к КС-2
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Delete('ks2/delcomment/:id')
  async delcomment(
    @Request() req,
    @Param() params
  ) {
    const author = req.user
    return await this.ks2Service.delcomment(params.id, author)
  }
}