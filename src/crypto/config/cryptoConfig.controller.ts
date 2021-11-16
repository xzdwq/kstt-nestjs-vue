import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseFilters,
  UseGuards
} from '@nestjs/common';

import { Response } from 'express';

import { AuthExceptionFilter } from '@src/core/auth-exceptions.filter';
import { AuthenticatedGuard } from "@src/core/guard/authenticated.guard";
import { CryptoConfigService } from '@src/crypto/config/cryptoConfig.service';
import { Roles } from "@src/core/guard/roles.decorator";

@Controller('api/cryptoconfig')
@UseFilters(AuthExceptionFilter)
export class CryptoConfigController {
  constructor(private readonly cryptoConfigService: CryptoConfigService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('signaturestype')
  async getSignaturesType() {
    return await this.cryptoConfigService.getSignaturesType()
  }

  // Получаем бланк для теста подписи
  @UseGuards(AuthenticatedGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Get('testfile')
  async getTestPath(
    @Res() res: Response
  ) {
    const path = await this.cryptoConfigService.getTestPath()
    res.setHeader('x-path', encodeURIComponent(path))
    return res.download(path)
  }

  // Тест подписи
  @UseGuards(AuthenticatedGuard)
  @Roles('admin', 'manager', 'editor', 'negotiator_ks2')
  @Post('testsign')
  async testSign(
    @Res() res: Response,
    @Body() body
  ) {
    const path = await this.cryptoConfigService.testSign(body.params)
    res.setHeader('x-path', encodeURIComponent(path))
    return res.download(path)
    // return path
  }
}