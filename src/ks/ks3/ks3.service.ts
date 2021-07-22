import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KS3Service {
  constructor(
    @InjectRepository(KS3Entity)
    private ks3Repository: Repository<KS3Entity>,
  ) {}

  async findAll(): Promise<object> {
    const [data, total] = await this.ks3Repository.findAndCount({
      relations: ['user', 'status']
    });

    return {
      data: data,
      total: total
    }
  }

  async createKS3(body): Promise<object> {
    const newKS3 = await this.ks3Repository.create({
      document_number: body.data.documentNumber,
      reporting_period: body.data.period,
      date_preparation: body.data.documentPeriod,
      status_id: 1,
      user_id: 1,
      project: '1'
    })
    await this.ks3Repository.save(newKS3)
    return {
      data: newKS3
    }
  }
}