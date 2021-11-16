import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  Query,
  UseFilters,
  UseGuards,
  Delete
} from "@nestjs/common";
import { Roles } from "@src/core/guard/roles.decorator";
import { RolesGuard } from "@src/core/guard/roles.guard";

import { KS3Service } from '@src/ks/ks3/ks3.service'
import { AuthExceptionFilter } from '@src/core/auth-exceptions.filter';
import { AuthenticatedGuard } from "@src/core/guard/authenticated.guard";

@Controller('api')
@UseFilters(AuthExceptionFilter)
export class KS3Controller {
  constructor(
    private ks3Service: KS3Service
  ){}

  @Get('/ks3')
  async getKS3(
    @Query('_page') page: number,
    @Query('_limit') limit: number,
    @Query('_query') query: string
  ): Promise<any>{
    return await this.ks3Service.findAll(page, limit, query)
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/ks3id/:id')
  async getKS3id(
    @Param() params
  ): Promise<any>{
    return await this.ks3Service.getKS3id(params.id)
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'editor', 'manager')
  @Get('/ks3/stageworkflow')
  async getKS3StageWorkflow(
    @Query('_workflow_id') workflow_id: number,
  ): Promise<any> {
    return await this.ks3Service.getKS3StageWorkflow(workflow_id)
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/ks3/newcrtificatenumber')
  async getNewCrtificatenumber() {
    return await this.ks3Service.getNewCrtificatenumber()
  }
  // Создание КС-3
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin', 'editor', 'manager')
  @Post('/ks3')
  async createKS3(
    @Request() req,
    @Body() body: Object
  ) {
    const author = req.user
    return this.ks3Service.createKS3(body, author)
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/ks3/stagegroup')
  async addGroupInStage(
    @Body() body
  ): Promise<any> {
    const params = body.params
    return this.ks3Service.setStageGroup(params)
  }

  @UseGuards(AuthenticatedGuard)
  @Put('/grouptype')
  async updateGroupType(
    @Body('params') params
  ): Promise<any> {
    return await this.ks3Service.updateGroupType(params)
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/ks3/sortworkflowelement')
  async setSortWorkflowElement(@Body() body: Object) {
    return this.ks3Service.setSortWorkflowElement(body)
  }

  @UseGuards(AuthenticatedGuard)
  @Put('ks3/metadata')
  async updateKS3Metadata(
    @Body('params') params
  ): Promise<any> {
    return await this.ks3Service.updateKS3Metadata(params)
  }
  // Удалить КС-3
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('admin')
  @Delete('/ks3')
  async delKS3(
    @Query('_ks3_id') ks3_id: number
  ) {
    return await this.ks3Service.delKS3(ks3_id)
  }
}