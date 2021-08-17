import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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
          workflow_id: workflow_id
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

    async onCreateWorkflowGroup(newWorkflowStage, groupUserDefault) {
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
              j.group.forEach((g) => {
                data.push({
                  code: g.code,
                  name_ru: g.name_ru,
                  name_en: g.name_en,
                  type_id: g.type_id,
                  stage_id: i.id,
                })
              })
            }
          })
        })
        workflowStageGroup.push(...data)
        const newGroup = await this.workflowStageGroupRepository.save(workflowStageGroup)

        return newGroup
    }

    async onCreateWorkflowUser(newGroup, groupUserDefault) {
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
            j.user.forEach((u) => {
              data.push({
                // TODO: full_name ...
                workflow_stage_group: i.id
              })
            })
          }
        })
      })
      workflowStageGroupUser.push(...data)
      const newUser = await this.workflowStageGroupUserRepository.save(workflowStageGroupUser)

      return newUser
    }
}