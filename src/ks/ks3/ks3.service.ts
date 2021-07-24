import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { KS3StageWorkflow } from '@src/ks/ks3/entity/ks3stageWorkflow.entity';

@Injectable()
export class KS3Service {
  constructor(
    @InjectRepository(KS3Entity)
    private ks3Repository: Repository<KS3Entity>,
    @InjectRepository(KS3StageWorkflow)
    private ks3StageWorkflowRepository: Repository<KS3StageWorkflow>,
  ) {}

  async findAll(): Promise<object> {
    const [data, total] = await this.ks3Repository.findAndCount({
      relations: ['user', 'status', 'ks3_stage_workflow']
    });

    return {
      success: true,
      data: data,
      total: total
    }
  }

  async getKS3StageWorkflow(): Promise<object> {
    const [data, total] = await this.ks3StageWorkflowRepository.findAndCount()
    return {
      success: true,
      data: data,
      total: total
    }
  }

  async getNewCrtificatenumber(): Promise<object> {
    const data = await this.ks3Repository.find({
      order: {
        id: "DESC"
      }
    })

    let newCertificateNumber = data[0]?.id ? +data[0].id + 1 : 1

    const match = await this.ks3Repository.find({
      where: {
        certificate_number: newCertificateNumber.toString(),
      }
    })

    if(match[0]?.certificate_number && (newCertificateNumber === +match[0].certificate_number)) {
      newCertificateNumber += 1
    }

    return {
      success: true,
      data: newCertificateNumber
    }
  }

  async createKS3(body): Promise<object> {
    const newKS3 = await this.ks3Repository.create({
      certificate_number: body.data.certificateNumber,
      document_number: body.data.documentNumber,
      reporting_period: body.data.period,
      date_preparation: body.data.documentPeriod,
      status_id: 1,
      user_id: 1,
      project: '1'
    })
    await this.ks3Repository.save(newKS3)

    const data = await this.ks3Repository.find({
      relations: ['user', 'status', 'ks3_stage_workflow'],
      where: { id: newKS3.id }
    })

    return {
      success: true,
      data: data
    }
  }
}