import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  async getKS3StageWorkflow() {
    return await this.ks3Service.getKS3StageWorkflow()
  }
  @Get('/ks3/newcrtificatenumber')
  async getNewCrtificatenumber() {
    return await this.ks3Service.getNewCrtificatenumber()
  }
  @Post('/ks3')
  async createKS3(@Body() body: Object) {
    return this.ks3Service.createKS3(body)
  }
}