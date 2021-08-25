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
          hierarchy: i.order_execution_stage,
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
          where: { id: -1 }
        }) // ищем по несуществующему id т.к. далее мы делаем спрет пуш и для этого нам нужна пустая выборка
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
                  order_execution_group: g.order_execution_group,
                  hierarchy: g.hierarchy,
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
      // let data = [], accum = 0
      // newGroup.forEach((i, new_group_idx) => {
      //   groupUserDefault.forEach((j, group_idx) => {
      //     if(i.code === j.code) {
      //       j.user_group.forEach((u, user_idx) => {
      //         data.push({
      //           full_name: u.user.full_name,
      //           email: u.user.email,
      //           department: u.user.department,
      //           position: u.user.position,
      //           role: u.user.role,
      //           workflow_id: +workflow_id,
      //           stage_id: i.stage_id,
      //           group_id: i.id,
      //           order_execution_user: i.type_id === 2
      //                                   ? accum + user_idx
      //                                   : accum,
      //           hierarchy: i.type_id === 2
      //                       ? i.hierarchy+'.'+(user_idx+1)
      //                       : i.hierarchy+'.'+1
      //         })
      //         i.type_id === 2
      //           ? accum = accum + user_idx
      //           : null
      //       })
      //       accum++
      //     }
      //   })
      // })
      let data = [], accum = 0
      newGroup.forEach((i, new_group_idx) => {
        accum = new_group_idx+1
        groupUserDefault.forEach((j, group_idx) => {
          if(i.code === j.code) {
            j.user_group.forEach((u, user_idx) => {
            i.type_id === 2
              ? accum = accum + user_idx
              : null
              data.push({
                full_name: u.user.full_name,
                email: u.user.email,
                department: u.user.department,
                position: u.user.position,
                role: u.user.role,
                workflow_id: +workflow_id,
                stage_id: i.stage_id,
                group_id: i.id,
                order_execution_user: accum,
                hierarchy: i.type_id === 2
                            ? i.hierarchy+'.'+(user_idx+1)
                            : i.hierarchy+'.'+1
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
      const data = await this.workflowStageRepository
        .createQueryBuilder('wf')
        .leftJoinAndSelect('wf.group', 'group')
        .leftJoinAndSelect('group.type', 'type')
        .leftJoinAndSelect('group.users', 'users')
        .where(`wf.workflow_id = ${workflow_id}`)
        .orderBy({
          'wf.order_execution_stage': 'ASC',
          'group.order_execution_group': 'ASC',
          'users.order_execution_user': 'ASC'
        })
        .getMany()
      const allUsersInWorkflowStage = await this.workflowStageGroupUserRepository.find({ where: { workflow_id: workflow_id } })
      return {
        data: data,
        total: data.length,
        allUsersInWorkflowStage: allUsersInWorkflowStage
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
              order_execution_group: 1, // TODO
              hierarchy: '1', // TODO
              stage_id: stage_id,
              workflow_id: workflow_id
            })
            const newGroup = await this.workflowStageGroupRepository.save(addGroup)
            // После добавления группы добавляем в нее пользователей из таблицы по умолчанию
            getGroupByCode.user_group.forEach((u) => {
              const newGroupUser = this.workflowStageGroupUserRepository.create({
                full_name: u.user.full_name,
                email: u.user.email,
                department: u.user.department,
                position: u.user.position,
                role: u.user.role,
                workflow_id: workflow_id,
                workflow_stage_group: newGroup,
                order_execution_user: 1, // TODO
                hierarchy: '1', // TODO
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

    async setSortWorkflowElement(params) {
      try {
        // Обновляем иерархию стадий
        params.stages.forEach(async (p_stage, p_stage_idx) => {
          const stage_wf = await this.workflowStageRepository.findOne(p_stage.id)
          stage_wf.order_execution_stage = p_stage.order_execution_stage
          stage_wf.hierarchy = p_stage.hierarchy
          await this.workflowStageRepository.save(stage_wf)
        })
        // Обновляем иерархию групп
        params.groups.forEach(async (p_group, p_group_idx) => {
          const group_wf = await this.workflowStageGroupRepository.findOne(p_group.id)
          group_wf.order_execution_group = p_group.order_execution_group
          group_wf.hierarchy = p_group.hierarchy
          await this.workflowStageGroupRepository.save(group_wf)
        })
        // Обновляем иерархию пользователей
        params.users.forEach(async (p_user, p_user_idx) => {
          const user_wf = await this.workflowStageGroupUserRepository.findOne(p_user.id)
          user_wf.order_execution_user = p_user.order_execution_user
          user_wf.hierarchy = p_user.hierarchy
          await this.workflowStageGroupUserRepository.save(user_wf)
        })
        return {
          success: true,
          message: 'Data sorted successfully'
        }
      } catch(e) {
        return {
          success: false,
          message: e.toString(),
        }
      }
    }
}