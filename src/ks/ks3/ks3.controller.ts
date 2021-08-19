import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from "@nestjs/common";

import { KS3Service } from '@src/ks/ks3/ks3.service'

@Controller('api')
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
  @Get('/ks3id/:id')
  async getKS3id(
    @Param() params
  ): Promise<any>{
    return await this.ks3Service.getKS3id(params.id)
  }
  @Get('/ks3/stageworkflow')
  async getKS3StageWorkflow(
    @Query('_workflow_id') workflow_id: number,
  ): Promise<any> {
    return await this.ks3Service.getKS3StageWorkflow(workflow_id)
  }
  @Get('/ks3/newcrtificatenumber')
  async getNewCrtificatenumber() {
    return await this.ks3Service.getNewCrtificatenumber()
  }
  @Post('/ks3')
  async createKS3(@Body() body: Object) {
    return this.ks3Service.createKS3(body)
  }
  @Post('/ks3/stagegroup')
  async addGroupInStage(
    @Body() body
  ): Promise<any> {
    const params = body.params
    return this.ks3Service.setStageGroup(params)
  }

  @Put('/grouptype')
  async updateGroupType(
    @Body('params') params
  ): Promise<any> {
    return await this.ks3Service.updateGroupType(params)
  }
}