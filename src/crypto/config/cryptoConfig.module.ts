import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignatureTypeEntity } from '@src/crypto/config/entity/signatureType.entity';
import { CryptoConfigController } from '@src/crypto/config/cryptoConfig.controller';
import { CryptoConfigService } from '@src/crypto/config/cryptoConfig.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SignatureTypeEntity
    ])
  ],
  providers: [
    CryptoConfigService
  ],
  controllers: [
    CryptoConfigController
  ],
})
export class CryptoConfigModule {}