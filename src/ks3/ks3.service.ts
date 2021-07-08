import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { KS3Entity } from '@ks3/entity/ks3.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KS3Service {
  constructor(
    @InjectRepository(KS3Entity)
    private ks3Repository: Repository<KS3Entity>,
  ) {}

  async findAll(): Promise<KS3Entity[]> {
    return this.ks3Repository.find()
  }
}