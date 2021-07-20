import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignatureTypeEntity } from './entity/signatureType.entity';

@Injectable()
export class CryptoConfigService {
  constructor(
    @InjectRepository(SignatureTypeEntity)
    private signatureTypeRepository: Repository<SignatureTypeEntity>
  ){}

  async getSignaturesType() {
    const [data, total] = await this.signatureTypeRepository.findAndCount();

    return {
      data: data,
      total: total
    }
  }
}