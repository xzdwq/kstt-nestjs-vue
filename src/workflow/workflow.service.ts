import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getConnection, getManager, Repository } from "typeorm";

import { WorkflowEntity } from '@src/workflow/entity/workflow.entity';
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';
import { WorkflowStageGroupEntity } from '@src/workflow/entity/workflow_stage_group.entity';
import { WorkflowStageGroupUserEntity } from '@src/workflow/entity/workflow_stage_group_user.entity'

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowEntity)
    private workflowRepository: Repository<WorkflowEntity>,
    @InjectRepository(WorkflowStageEntity)
    private workflowStageRepository: Repository<WorkflowStageEntity>,
    @InjectRepository(WorkflowStageGroupEntity)
    private workflowStageGroupRepository: Repository<WorkflowStageGroupEntity>,
    @InjectRepository(WorkflowStageGroupUserEntity)
    private workflowStageGroupUserRepository: Repository<WorkflowStageGroupUserEntity>
    ) {}

    async onCreateWorkflow() {
      const newWorkflow = await this.workflowRepository.create({
        last_action_ru: 'Карточка создана',
        last_action_en: 'Card created',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
      })
      await this.workflowRepository.save(newWorkflow)
      return newWorkflow
    }

    async onCreateWorkflowStage(stageDefault, workflow_id) {
      let dataStage =[]
      stageDefault.forEach((i, idx) => {
        const data = {
          name_ru: i.name_ru,
          short_name_ru: i.short_name_ru,
          name_en: i.name_en,
          short_name_en: i.short_name_en,
          previous_stage: i.previous_stage,
          next_stage: i.next_stage,
          order_execution_stage: i.order_execution_stage,
          action: idx === 0 ? 1 : 0,
          workflow_id: workflow_id,
          deadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }
        dataStage.push(data)
      })
      const workflowStage = await this.workflowStageRepository.find({
        take: 1,
        order: {
          id: "DESC"
        }
      })
      workflowStage.push(...dataStage)
      await this.workflowStageRepository.save(workflowStage)

      const newWorkflowStage = await this.workflowStageRepository.find({
        where: {
          workflow_id: workflow_id
        }
      })
      return newWorkflowStage
    }

    async onCreateWorkflowGroup(workflow_id, newWorkflowStage, groupUserDefault) {
        const workflowStageGroup = await this.workflowStageGroupRepository.find({
          take: 1,
          order: {
            id: "DESC"
          }
        })
        let data = []
        newWorkflowStage.forEach((i) => {
          groupUserDefault.forEach((j) => {
            if(i.order_execution_stage === j.order_execution_stage) {
              j.ks3_stage_workflow_group.forEach((g) => {
                data.push({
                  code: g.group.code,
                  name_ru: g.group.name_ru,
                  name_en: g.group.name_en,
                  type_id: g.group.type_id,
                  workflow_id: +workflow_id,
                  stage_id: i.id,
                  deadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
                })
              })
            }
          })
        })
        workflowStageGroup.push(...data)
        const newGroup = await this.workflowStageGroupRepository.save(workflowStageGroup)

        return newGroup
    }

    async onCreateWorkflowUser(workflow_id, newGroup, groupUserDefault) {
      const workflowStageGroupUser = await this.workflowStageGroupUserRepository.find({
        take: 1,
        order: {
          id: "DESC"
        }
      })
      let data = []
      newGroup.forEach((i) => {
        groupUserDefault.forEach((j) => {
          if(i.code === j.code) {
            j.user_group.forEach((u) => {
              data.push({
                full_name: u.user.full_name,
                email: u.user.email,
                department: u.user.department,
                position: u.user.position,
                role: u.user.role,
                workflow_id: +workflow_id,
                stage_id: i.stage_id,
                group_id: i.id
              })
            })
          }
        })
      })
      workflowStageGroupUser.push(...data)
      const newUser = await this.workflowStageGroupUserRepository.save(workflowStageGroupUser)

      return newUser
    }
    async onGetWorkflowStageById(workflow_id) {
      const [data, total] = await this.workflowStageRepository.findAndCount({
        relations: [
          'group',
          'group.type',
          'group.users'
        ],
        where: {
          workflow_id: workflow_id
        }
      })
      return {
        data: data,
        total: total
      }
    }

    async onSetStageGroup(stage_id, workflow_id, params, groupDefault) {
      // Получаем стадию с группами
      const stagegroup = await this.workflowStageRepository.findOne(stage_id, {
        relations: ['group'],
        where: {
          workflow_id: workflow_id
        }
      })
      let data = {
        stage_id: stage_id,
        workflow_id: workflow_id,
        add: [],
        remove: []
      }
      for(const pg of params.group) {
        const match = stagegroup.group.find(x => x.code === pg.code)
        if(match) {
          // stagegroup.group = stagegroup.group.filter((g) => g.id !== match.id)
          // если группу исключили из стадии
          if(!pg.check) {
            const delGroup = stagegroup.group.filter((g) => g.id === match.id)
            // Удаляем пользователей из группы
            const user = await this.workflowStageGroupUserRepository.find({
              where: {
                workflow_stage_group: +delGroup[0].id
              }
            })
            await this.workflowStageGroupUserRepository.remove(user)
            // Удаляем группу
            const group = await this.workflowStageGroupRepository.find({
              where: {
                id: +delGroup[0].id
              }
            })
            const removeGroup = await this.workflowStageGroupRepository.remove(group)
            data.remove.push(removeGroup[0])
          }
        } else {
          // если группу добавили в стадию
          if(pg.check) {
            const getGroupByCode = groupDefault.data.find(x => x.code === pg.code)
            const addGroup = await this.workflowStageGroupRepository.create({
              code: getGroupByCode.code,
              name_ru: getGroupByCode.name_ru,
              name_en: getGroupByCode.name_en,
              type_id: getGroupByCode.type_id,
              stage_id: stage_id,
              workflow_id: workflow_id
            })
            const newGroup = await this.workflowStageGroupRepository.save(addGroup)
            // После добавления группы добавляем в нее пользователей из таблицы по умолчанию
            getGroupByCode.user.forEach((u) => {
              const newGroupUser = this.workflowStageGroupUserRepository.create({
                full_name: u.full_name,
                email: u.email,
                department: u.department,
                position: u.position,
                role: u.role,
                workflow_id: workflow_id,
                workflow_stage_group: newGroup,
                stage_id: newGroup.stage_id,
                group_id: newGroup.id
              })
              this.workflowStageGroupUserRepository.save(newGroupUser)
            })
            data.add.push(newGroup)
          }
        }
      }

      return data
    }

    async onUpdateGroupType(params) {
      const workflow_id = params.workflow_id,
            group_id = params.group_id,
            group_type = params.group_type,
            cascade = params.cascade
      let result;
      const group: any = await this.workflowStageGroupRepository.findOne(group_id)
      // if(group.type_id != group_type) {
        if(cascade) {
          const allGroupInWorkflow = await this.workflowStageGroupRepository.find({
            where: {
              workflow_id: workflow_id,
              code: group.code
            }
          })
          allGroupInWorkflow.forEach((g) => {
            g.type_id = group_type
          })
          result = await this.workflowStageGroupRepository.save(allGroupInWorkflow)
        } else {
          group.type_id = group_type
          result = await this.workflowStageGroupRepository.save(group)
        }
      // } else {
      //   result = group
      // }
      return result
    }
}