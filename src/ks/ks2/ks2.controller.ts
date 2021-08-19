import {
  Body,
  Controller,
  Post
} from "@nestjs/common";
import { FormDataRequest } from "nestjs-form-data"

import { KS2Service } from '@src/ks/ks2/ks2.service'

@Controller('api')
export class KS2Controller {
  constructor(
    private ks2Service: KS2Service
  ) {}

  @Post('/ks2/upload')
  @FormDataRequest()
  async uploadKS2File(
    @Body() body
  ) {
    return await this.ks2Service.uploadKS2File(body)
  }
}