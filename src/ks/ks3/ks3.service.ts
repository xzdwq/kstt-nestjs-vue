import { Inject, Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { KS3StageWorkflow } from '@src/ks/ks3/entity/ks3stageWorkflow.entity';
import { GroupService } from '@src/group/group.service';
import { WorkflowService } from '@src/workflow/workflow.service';

@Injectable()
export class KS3Service {
  constructor(
    @InjectRepository(KS3Entity)
    private ks3Repository: Repository<KS3Entity>,
    @InjectRepository(KS3StageWorkflow)
    private ks3StageWorkflowRepository: Repository<KS3StageWorkflow>,
    @Inject(GroupService)
    private groupService: GroupService,
    @Inject(WorkflowService)
    private workflowService: WorkflowService
  ) {}

  async findAll(page: number, limit: number, query: string): Promise<object> {
    if(!query) query = ''

    const [data, total] = await this.ks3Repository.findAndCount({
      relations: [
        'user',
        'project',
        'workflow',
        'workflow.stage',
        'workflow.stage.group',
        'workflow.stage.group.type',
        'workflow.stage.group.users'
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
        'workflow.stage.group.type',
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

  async getKS3StageWorkflow(workflow_id): Promise<object> {
    if(workflow_id) {
      const workflowStageById = await this.workflowService.onGetWorkflowStageById(workflow_id)
      const ks3info = await this.ks3Repository.find({
        where: {
          workflow_id: workflow_id
        }
      })
      return {
        success: true,
        data: workflowStageById.data,
        total: workflowStageById.total,
        ks3: ks3info
      }
    }
    else {
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
    // 1. Создаем новый workflow и получаем его id
    const newWorkflow = await this.workflowService.onCreateWorkflow()
    // 2. Создаем стадии согласования для вновь созданного workflow копируя их из таблицы по умолчанию
    const stageDefault = await this.ks3StageWorkflowRepository.find()
    const newWorkflowStage = await this.workflowService.onCreateWorkflowStage(stageDefault, newWorkflow.id)
    // 3. Создаем группы и присваиваем их ранее созданным стадиям по логике как из таблицы по умолчанию
    const stageGroupDefault = await this.ks3StageWorkflowRepository.find({
      relations: ['group']
    })
    const newWorkflowGroup = await this.workflowService.onCreateWorkflowGroup(newWorkflow.id, newWorkflowStage, stageGroupDefault)
    // 4. Создаем пользователей и присваиваем их в ранее созданные группы по логике как из таблицы по умолчанию
    const getGroupDefault: any = await this.groupService.findAll()
    const groupDefault = getGroupDefault.data;
    await this.workflowService.onCreateWorkflowUser(newWorkflow.id, newWorkflowGroup, groupDefault)
    // 5. Создаем новую карточку КС-3 и присваиваем ей ранее созданный workflow_id
    const createNewKS3 = await this.ks3Repository.create({
      certificate_number: body.data.certificateNumber,
      document_number: body.data.documentNumber,
      reporting_period: body.data.period,
      date_preparation: body.data.documentPeriod,
      user_id: 1,
      workflow_id: newWorkflow.id
    })
    const newKS3 = await this.ks3Repository.save(createNewKS3)

    const data = await this.ks3Repository.find({
      relations: [
        'user',
        'project',
        'workflow',
        'workflow.stage',
        'workflow.stage.group',
        'workflow.stage.group.type',
        'workflow.stage.group.users'
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
    const workflow_id = params.workflow_id
    let result
    if(workflow_id) {
      // WF
      const getGroupAll = await this.groupService.findAll();
      result = await this.workflowService.onSetStageGroup(stage_id, workflow_id, params, getGroupAll)
    } else {
      // Default
      const stagegroup = await this.ks3StageWorkflowRepository.findOne(stage_id, {
        relations: ['group']
      })
      for(const pg of params.group) {
        const matchIndex = stagegroup.group.findIndex(x => x.id === pg.id)
        if(matchIndex >= 0) {
          // если группу исключили из стадии
          if(!pg.check) stagegroup.group.splice(matchIndex, 1);
        } else {
          // если группу добавили в стадию
          if(pg.check) {
            const getGroupById = await this.groupService.findOne(pg.id)
            stagegroup.group.push(getGroupById['data'])
          }
        }
      }
      result = await this.ks3StageWorkflowRepository.save(stagegroup)
    }

    return {
      data: result
    }
  }

  async updateGroupType(params) {
    const workflow_id = params.workflow_id,
          group_id = params.group_id,
          group_type = params.group_type;
    let data
    if(workflow_id) {
      data = await this.workflowService.onUpdateGroupType(params)
    } else {
      data = await this.groupService.onUpdateGroupType(params)
    }
    return {
      success: true,
      data: data,
      workflow_id: workflow_id,
      group_id: group_id,
      group_type: group_type
    }
  }
}