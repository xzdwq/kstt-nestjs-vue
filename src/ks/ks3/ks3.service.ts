import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity';
import { GroupService } from '@src/group/group.service';
import { WorkflowService } from '@src/workflow/workflow.service';

@Injectable()
export class KS3Service {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @InjectRepository(KS3Entity)
    private ks3Repository: Repository<KS3Entity>,
    @Inject(GroupService)
    private groupService: GroupService,
    @Inject(WorkflowService)
    private workflowService: WorkflowService
  ) {}

  async findAll(page: number, limit: number, query: string): Promise<object> {
    if(!query) query = ''

    const queryB = await this.ks3Repository
        .createQueryBuilder('ks3')
        .leftJoinAndSelect('ks3.user', 'user')
        .leftJoinAndSelect('ks3.ks2', 'ks2')
        .leftJoinAndSelect('ks3.project', 'project')
        .leftJoinAndSelect('ks3.workflow', 'workflow')
        .leftJoinAndSelect('workflow.stage', 'stage')
        .leftJoinAndSelect('stage.types', 'types')
        .leftJoinAndSelect('types.groups', 'groups')
        .leftJoinAndSelect('groups.type', 'type')
        .leftJoinAndSelect('groups.users', 'users')
        .where('ks3.certificate_number like :query', { query:`%${query}%` })
        .orWhere('ks3.document_number like :query', { query:`%${query}%` })
        .orderBy({
          'ks3.create_at': 'DESC',
          'stage.order_execution_stage': 'ASC',
          'types.order_execution_type': 'ASC',
          'groups.order_execution_group': 'ASC',
          'users.order_execution_user': 'ASC'
        })

    const dataAll = await queryB
      // Данный подход в пагинации не работает т.к. присутствует leftJoinAndSelect и результаты не группируются
      // .limit(limit)
      // .offset(limit * (page - 1))
      .getMany()
    // Пагинация
    const data = dataAll.slice((limit * (page - 1)), (limit * page))
    const total = await queryB.getCount();

    return {
      success: true,
      data: data,
      total: total
    }
  }

  async getKS3id(id: number): Promise<object> {
    const data = await this.ks3Repository
      .createQueryBuilder('ks3')
      .leftJoinAndSelect('ks3.user', 'user')
      .leftJoinAndSelect('ks3.ks2', 'ks2')
      .leftJoinAndSelect('ks3.project', 'project')
      .leftJoinAndSelect('ks3.workflow', 'workflow')
      .leftJoinAndSelect('workflow.stage', 'stage')
      .leftJoinAndSelect('stage.types', 'types')
      .leftJoinAndSelect('types.groups', 'groups')
      .leftJoinAndSelect('groups.type', 'type')
      .leftJoinAndSelect('groups.users', 'users')
      .where('ks3.id = :id', { id: id })
      .orderBy({
        'ks3.create_at': 'DESC',
        'stage.order_execution_stage': 'ASC',
        'types.order_execution_type': 'ASC',
        'groups.order_execution_group': 'ASC',
        'users.order_execution_user': 'ASC'
      })
      .getMany()
    // Информация по текущей стадии согласования
    const wf_id_by_ks3 = data[0].workflow_id
    const currentStageWFId = await this.workflowService.onGetCurrentWorkflowStageById(wf_id_by_ks3)

    return {
      success: true,
      data: data,
      currentStage: currentStageWFId,
      total: data.length
    }
  }

  async getKS3StageWorkflow(workflow_id): Promise<object> {
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
      ks3: ks3info,
      allTypesInWorkflow: workflowStageById.allTypesInWorkflow,
      allGroupsInWorkflowStage: workflowStageById.allGroupsInWorkflowStage,
      allUsersInWorkflowStage: workflowStageById.allUsersInWorkflowStage
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

  async createKS3(body, author): Promise<object> {
    // 1. Создаем новый workflow и получаем его id
    const newWorkflow = await this.workflowService.onCreateWorkflow()

    // 2. Создаем стадии согласования для вновь созданного workflow копируя их из таблицы по умолчанию
    const newWorkflowStage = await this.workflowService.onCreateWorkflowStage(newWorkflow.id)

    // 3. Создаем новые типы будущих групп по логике как из таблицы по умолчанию
    const newWorkflowType = await this.workflowService.onCreateWorkflowType(newWorkflow.id, newWorkflowStage)

    // 4. Создаем группы и присваиваем их ранее созданным стадиям по логике как из таблицы по умолчанию
    const newWorkflowGroup = await this.workflowService.onCreateWorkflowGroup(newWorkflow.id, newWorkflowStage, newWorkflowType)

    // 5. Создаем пользователей и присваиваем их в ранее созданные группы по логике как из таблицы по умолчанию
    // const getGroupDefault: any = await this.groupService.findAll()
    // const groupDefault = getGroupDefault.data;
    await this.workflowService.onCreateWorkflowUser(newWorkflow.id, newWorkflowGroup)
    // 6. Создаем новую карточку КС-3 и присваиваем ей ранее созданный workflow_id
    const createNewKS3 = await this.ks3Repository.create({
      certificate_number: body.data.certificateNumber,
      document_number: body.data.documentNumber,
      reporting_period: body.data.period,
      date_preparation: body.data.documentPeriod,
      user_id: author.DB.id,
      workflow_id: newWorkflow.id
    })
    const newKS3 = await this.ks3Repository.save(createNewKS3)

    const data: any = await this.ks3Repository
      .createQueryBuilder('ks3')
      .leftJoinAndSelect('ks3.user', 'user')
      .leftJoinAndSelect('ks3.ks2', 'ks2')
      .leftJoinAndSelect('ks3.project', 'project')
      .leftJoinAndSelect('ks3.workflow', 'workflow')
      .leftJoinAndSelect('workflow.stage', 'stage')
      .leftJoinAndSelect('stage.types', 'types')
      .leftJoinAndSelect('types.groups', 'groups')
      .leftJoinAndSelect('groups.type', 'type')
      .leftJoinAndSelect('groups.side', 'side')
      .leftJoinAndSelect('groups.users', 'users')
      .where('ks3.id = :id', { id: newKS3.id })
      .orderBy({
        'ks3.create_at': 'DESC',
        'stage.order_execution_stage': 'ASC',
        'types.order_execution_type': 'ASC',
        'groups.order_execution_group': 'ASC',
        'users.order_execution_user': 'ASC'
      })
      .getMany()

    this.logger.log(`New KS3 id: ${data[0].id}, workflow_id: ${data[0].workflow_id} created`, KS3Service.name)

    return {
      success: true,
      data: data
    }
  }

  async setStageGroup(params): Promise<object> {
    const stage_id = params.stage_id
    const workflow_id = params.workflow_id
    // WF
    const getGroupAll = await this.groupService.findAll();
    const result = await this.workflowService.onSetStageGroup(stage_id, workflow_id, params, getGroupAll)

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

  async setSortWorkflowElement(body) {
    const result = await this.workflowService.setSortWorkflowElement(body.params)
    return result
  }

  async updateKS3Metadata(params) {
    const ks3ById = await this.ks3Repository.findOne(params.id)
    ks3ById.certificate_number = params.certificate_number
    ks3ById.document_number = params.document_number
    ks3ById.date_preparation = params.date_preparation
    ks3ById.reporting_period = params.reporting_period
    const data = await this.ks3Repository.save(ks3ById)
    return {
      success: true,
      data: data
    }
  }
  // Удалить КС-3
  async delKS3(ks3_id) {
    const ks3_info = await this.ks3Repository.findOne(ks3_id)
    // Удаляем КС-3
    await this.ks3Repository.delete({
      id: ks3_id
    })
    // Удаляем WF КС-3
    await this.workflowService.deleteWF(ks3_info.workflow_id)
    return {
      success: true
    }
  }
  // Изменить стадию у КС-3
  async changeStage(ks3_id, stage_code) {
    const ks3_info: any = await this.ks3Repository.findOne(ks3_id, {
      relations: ['workflow']
    })
    const wf_id = ks3_info.workflow.id
    // Указываем, что КС-3 стартанула
    await this.workflowService.start(wf_id, stage_code)
    // await this.ks3Repository.update(ks3_id, { ks2_status_id: status.id })
    return {
      success: true
    }
  }
}