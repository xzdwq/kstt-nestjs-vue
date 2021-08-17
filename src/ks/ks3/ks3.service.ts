import { Inject, Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { KS3StageWorkflow } from '@src/ks/ks3/entity/ks3stageWorkflow.entity';
import { GroupService } from '@src/group/group.service';

@Injectable()
export class KS3Service {
  constructor(
    @InjectRepository(KS3Entity)
    private ks3Repository: Repository<KS3Entity>,
    @InjectRepository(KS3StageWorkflow)
    private ks3StageWorkflowRepository: Repository<KS3StageWorkflow>,
    @Inject(GroupService)
    private groupService: GroupService,
  ) {}

  async findAll(page: number, limit: number, query: string): Promise<object> {
    if(!query) query = ''
    // const [data, total] = await this.ks3Repository.findAndCount({
    //   relations: [
    //     'user',
    //     'user.group',
    //     'ks3_stage_workflow',
    //     'ks3_stage_workflow.group',
    //     'project'
    //   ],
    //   skip: limit * (page - 1),
    //   take: limit,
    //   where: [
    //     { certificate_number: Like(`%${query}%`) },
    //     { document_number: Like(`%${query}%`) }
    //   ],
    //   order: {
    //     create_at: 'DESC'
    //   }
    // });

    const [data, total] = await this.ks3Repository.findAndCount({
      relations: [
        'user',
        'project',
        'workflow',
        'workflow.stage',
        'workflow.stage.group',
        'workflow.stage.group.users'
      ]
    })

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
        'project',
        'workflow',
        'workflow.stage',
        'workflow.stage.group',
        'workflow.stage.group.users'
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
        'group.user',
        'group.type'
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
      workflow_id: body.data.ks3StageWorkflow
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

  async setStageGroup(params): Promise<object> {
    const stage_id = params.stage_id
    const wfstage = await this.ks3StageWorkflowRepository.findOne(stage_id, {
      relations: ['group']
    })

    for(const pg of params.group) {
      const matchIndex = wfstage.group.findIndex(x => x.id === pg.id)
      if(matchIndex >= 0) {
        // если группу исключили из стадии
        if(!pg.check) wfstage.group.splice(matchIndex, 1);
      } else {
        // если группу добавили в стадию
        if(pg.check) {
          const getGroupById = await this.groupService.findOne(pg.id)
          wfstage.group.push(getGroupById['data'])
        }
      }
    }
    const result = await this.ks3StageWorkflowRepository.save(wfstage)
    return {
      data: result
    }
  }
}