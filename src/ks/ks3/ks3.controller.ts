import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { KS3Service } from '@src/ks/ks3/ks3.service'

@Controller('api')
export class KS3Controller {
  constructor(
    private ks3Service: KS3Service
  ){}

  @Get('/ks3')
  async getKS3() {
    return await this.ks3Service.findAll()
  }
  @Post('/ks3')
  async createKS3(@Body() body: Object) {
    return this.ks3Service.createKS3(body)
  }
}