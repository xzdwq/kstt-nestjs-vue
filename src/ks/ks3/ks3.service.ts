import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
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

  async findAll(page: number, limit: number, query: string): Promise<object> {
    if(!query) query = ''
    const [data, total] = await this.ks3Repository.findAndCount({
      relations: [
        'user',
        'user.group',
        'ks3_stage_workflow',
        'ks3_stage_workflow.group',
        'project'
      ],
      skip: limit * (page - 1),
      take: limit,
      where: [
        { certificate_number: Like(`%${query}%`) },
        { document_number: Like(`%${query}%`) }
      ],
      order: {
        create_at: 'DESC'
      }
    });

    return {
      success: true,
      data: data,
      total: total
    }
  }

  async getKS3id(id: number): Promise<object> {
    const [data, total] = await this.ks3Repository.findAndCount({
      relations: [
        'user',
        'user.group',
        'ks3_stage_workflow',
        'ks3_stage_workflow.group',
        'project'
      ],
      where: [
        { id: id }
      ]
    })
    return {
      success: true,
      data: data,
      total: total
    }
  }

  async getKS3StageWorkflow(): Promise<object> {
    const [data, total] = await this.ks3StageWorkflowRepository.findAndCount({
      relations: [
        'group',
        'group.user'
      ]
    })
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
      user_id: 1,
      ks3_stage_workflow: body.data.ks3StageWorkflow
    })
    await this.ks3Repository.save(newKS3)

    const data = await this.ks3Repository.find({
      relations: [
        'user',
        'user.group',
        'ks3_stage_workflow',
        'ks3_stage_workflow.group',
        'project'
      ],
      where: { id: newKS3.id }
    })

    return {
      success: true,
      data: data
    }
  }
}