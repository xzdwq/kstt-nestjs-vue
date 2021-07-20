import {
  Controller,
  Get
} from '@nestjs/common';
import { CryptoConfigService } from './cryptoConfig.service';

@Controller('api/cryptoconfig')
export class CryptoConfigController {
  constructor(private readonly cryptoConfigService: CryptoConfigService) {}

  @Get('signaturestype')
  async getSignaturesType() {
    return await this.cryptoConfigService.getSignaturesType()
  }
}