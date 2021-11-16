import { Inject, Injectable, HttpService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DefaultWorkflowStageEntity } from "@src/workflow/entity/default/default_workflow_stage.entity";
import { DefaultWorkflowStageTypeEntity } from "@src/workflow/entity/default/default_workflow_stage_type.entity";
import { DefaultWorkflowStageGroupEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group.entity";
import { DefaultWorkflowStageGroupUserEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group_user.entity";

import { WorkflowEntity } from '@src/workflow/entity/workflow.entity';
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';
import { WorkflowStageTypeEntity } from "@src/workflow/entity/workflow_stage_type.entity";
import { WorkflowStageGroupEntity } from '@src/workflow/entity/workflow_stage_type_group.entity';
import { WorkflowStageGroupUserEntity } from '@src/workflow/entity/workflow_stage_type_group_user.entity'

import { UserEntity } from '@src/user/entity/user.entity'
import { UserGroupEntity } from '@src/user/entity/user_group.entity'

import { GroupEntity } from '@src/group/entity/group.entity';
import { GroupService } from '@src/group/group.service';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@src/auth/token/token.service'
import { UserService } from '@src/user/user.service';

@Injectable()
export class WorkflowService {
  constructor(
    private http: HttpService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private userService: UserService,
    // Репозитории с маршрутами по умолчанию
    @InjectRepository(DefaultWorkflowStageEntity)
    private defaultWorkflowStageRepository: Repository<DefaultWorkflowStageEntity>,
    @InjectRepository(DefaultWorkflowStageTypeEntity)
    private defaultWorkflowStageTypeRepository: Repository<DefaultWorkflowStageTypeEntity>,
    @InjectRepository(DefaultWorkflowStageGroupEntity)
    private defaultWorkflowStageGroupRepository: Repository<DefaultWorkflowStageGroupEntity>,
    @InjectRepository(DefaultWorkflowStageGroupUserEntity)
    private defaultWorkflowStageGroupUserRepository: Repository<DefaultWorkflowStageGroupUserEntity>,
    // Репозитории с индивидуальными маршрутами
    @InjectRepository(WorkflowEntity)
    private workflowRepository: Repository<WorkflowEntity>,
    @InjectRepository(WorkflowStageTypeEntity)
    private workflowStageTypeRepository: Repository<WorkflowStageTypeEntity>,
    @InjectRepository(WorkflowStageEntity)
    private workflowStageRepository: Repository<WorkflowStageEntity>,
    @InjectRepository(WorkflowStageGroupEntity)
    private workflowStageGroupRepository: Repository<WorkflowStageGroupEntity>,
    @InjectRepository(WorkflowStageGroupUserEntity)
    private workflowStageGroupUserRepository: Repository<WorkflowStageGroupUserEntity>,
    // Репозиторий пользователей
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserGroupEntity)
    private userGroupRepository: Repository<UserGroupEntity>,
    // Репозиторий групп
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
    // Сервис управления группами
    @Inject(GroupService)
    private groupService: GroupService,
    ) {}

    // Получить маршрут согласования по умолчанию
    async getDefaultWorkflow() {
      const data = await this.defaultWorkflowStageRepository
        .createQueryBuilder('wf')
        .leftJoinAndSelect('wf.types', 'type_info')
        .leftJoinAndSelect('type_info.type', 'type_def')
        .leftJoinAndSelect('type_info.groups', 'groups')
        .leftJoinAndSelect('groups.group', 'group_info')
        .leftJoinAndSelect('groups.side', 'side')
        .leftJoinAndSelect('group_info.type', 'type')
        .leftJoinAndSelect('groups.users', 'users')
        .leftJoinAndSelect('users.user', 'user_info')
        .orderBy({
          'wf.order_execution_stage': 'ASC',
          'type_info.order_execution_type': 'ASC',
          'groups.order_execution_group': 'ASC',
          'users.order_execution_user': 'ASC'
        })
        .getMany()

      const allGroupInWorkflow = await this.defaultWorkflowStageGroupRepository.find()
      const allUsersInWorkflow = await this.defaultWorkflowStageGroupUserRepository.find()
      const allTypesInWorkflow = await this.defaultWorkflowStageTypeRepository.find()

      return {
        success: true,
        data: data,
        allTypesInWorkflow: allTypesInWorkflow,
        allGroupInWorkflow: allGroupInWorkflow,
        allUsersInWorkflow: allUsersInWorkflow,
        total: data.length
      }
    }

    // Создать новый индивидуальный маршрут
    async onCreateWorkflow() {
      const newWorkflow = await this.workflowRepository.create({
        last_action_ru: 'Карточка создана',
        last_action_en: 'Card created',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
      })
      await this.workflowRepository.save(newWorkflow)
      return newWorkflow
    }

    // Создаем стадии согласования для индивидуального маршрута копируя их из defaultWorkflowStageRepository
    async onCreateWorkflowStage(workflow_id) {
      const stageDefault = await this.defaultWorkflowStageRepository.find()
      let dataStage = []
      stageDefault.forEach((i, idx) => {
        const data = {
          code: i.code,
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
        where: { id: -1 }
      }) // ищем по несуществующему id т.к. далее мы делаем спрет пуш и для этого нам нужна пустая выборка
      workflowStage.push(...dataStage)
      await this.workflowStageRepository.save(workflowStage)

      const newWorkflowStage = await this.workflowStageRepository.find({
        where: {
          workflow_id: workflow_id
        }
      })
      return newWorkflowStage
    }

    // Создаем новые типы будущих групп по логике как из таблицы по умолчанию
    async onCreateWorkflowType(workflow_id, newWorkflowStage) {
      const stageDefault = await this.defaultWorkflowStageRepository.find({
        relations: ['types', 'types.type']
      })
      let data = []
      newWorkflowStage.forEach((ns) => {
        stageDefault.forEach((ds) => {
          if(ns.order_execution_stage === ds.order_execution_stage) {
            if(ds.types.length > 0) {
              ds.types.forEach((t) => {
                data.push({
                  order_execution_type: t.order_execution_type,
                  hierarchy: t.hierarchy,
                  workflow_id: +workflow_id,
                  type_id: t.type_id,
                  stage_id: ns.id
                })
              })
            }
          }
        })
      })
      const newWorkflowType = await this.workflowStageTypeRepository.find({ where: { id: -1 } })
      newWorkflowType.push(...data)
      const newType = await this.workflowStageTypeRepository.save(newWorkflowType)

      return newType
    }

    // Создаем группы и присваиваем их ранее созданным стадиям по логике как из таблицы по умолчанию
    async onCreateWorkflowGroup(workflow_id, newWorkflowStage, newWorkflowType) {
      const defaultStage = await this.defaultWorkflowStageRepository.find({
        relations: ['types', 'types.groups', 'types.groups.group', 'types.groups.side']
      })
      let data = []
      for(let newStage of newWorkflowStage) {
        const matchStage = defaultStage.find(ds => ds.code === newStage.code)
        // Если совпала новая стадия со стадией по умолчанию
        if(matchStage) {
          for(let t of matchStage.types) {
            const matchType = newWorkflowType.find(nt => nt.hierarchy === t.hierarchy)
            // Если совпал новый тип с типом по умолчанию
            if(matchType) {
              for(let g of t.groups) {
                // Добавляем группу в тип
                const newGroup = await this.workflowStageGroupRepository.save({
                  code: g.group['code'],
                  name_ru: g.group['name_ru'],
                  name_en: g.group['name_en'],
                  type_id: matchType.id,
                  workflow_id: +workflow_id,
                  order_execution_group: g.order_execution_group,
                  hierarchy: g.hierarchy,
                  stage_id: matchType.stage_id,
                  deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                  side_id: g.side['id']
                })
                data.push(newGroup)
              }
            }
          }
        }
      }

      return data
    }

    async onCreateWorkflowUser(workflow_id, newGroup) {
      const groupUserDefault: any = await this.defaultWorkflowStageGroupRepository.find({
        relations: ['group', 'users', 'users.user']
      })
      let data = []
      newGroup.forEach((i, new_group_idx) => {
        groupUserDefault.forEach((j, group_idx) => {
          if(
            i.code === j.group.code
            && i.order_execution_group === j.order_execution_group
          ) {
            j.users.forEach((u, user_idx) => {
              data.push({
                full_name: u.user.full_name,
                login: u.user.login,
                email: u.user.email,
                department: u.user.department,
                position: u.user.position,
                role: u.user.role,
                order_execution_user: u.order_execution_user,
                hierarchy: u.hierarchy,
                workflow_id: +workflow_id,
                stage_id: i.stage_id,
                type_id: i.type_id,
                group_id: i.id
              })
            })
          }
        })
      })
      const workflowStageGroupUser = await this.workflowStageGroupUserRepository.find({
        where: { id: -1 }
      })
      workflowStageGroupUser.push(...data)
      const newUser = await this.workflowStageGroupUserRepository.save(workflowStageGroupUser)

      return newUser
    }
    async onGetWorkflowStageById(workflow_id) {
      const data = await this.workflowStageRepository
        .createQueryBuilder('stage')
        .leftJoinAndSelect('stage.types', 'types')
        .leftJoinAndSelect('types.type', 'type')
        .leftJoinAndSelect('types.groups', 'groups')
        .leftJoinAndSelect('groups.side', 'side')
        .leftJoinAndSelect('groups.users', 'users')
        .where('stage.workflow_id = :workflow_id', { workflow_id: workflow_id })
        .orderBy({
          'stage.order_execution_stage': 'ASC',
          'types.order_execution_type': 'ASC',
          'groups.order_execution_group': 'ASC',
          'users.order_execution_user': 'ASC'
        })
        .getMany()
      const allUsersInWorkflowStage = await this.workflowStageGroupUserRepository.find({ where: { workflow_id: workflow_id } })
      const allGroupsInWorkflowStage = await this.workflowStageGroupRepository.find({ where: { workflow_id: workflow_id } })
      const allTypesInWorkflow = await this.workflowStageTypeRepository.find({ where: { workflow_id: workflow_id } })
      return {
        data: data,
        total: data.length,
        allTypesInWorkflow: allTypesInWorkflow,
        allGroupsInWorkflowStage: allGroupsInWorkflowStage,
        allUsersInWorkflowStage: allUsersInWorkflowStage
      }
    }

    async onGetCurrentWorkflowStageById(workflow_id) {
      const wf_data = await this.workflowRepository.findOne({
        where: {
          id: workflow_id
        }
      })
      const stageInfo = await this.workflowStageRepository.findOne({
        where: {
          workflow_id: workflow_id,
          order_execution_stage: wf_data.current_stage
        }
      })
      return stageInfo
    }

    async onSetStageGroup(stage_id, workflow_id, params, groupDefault) {
      // Получаем стадию с группами
      // const stagegroup = await this.workflowStageRepository.findOne(stage_id, {
      //   relations: ['group'],
      //   where: {
      //     workflow_id: workflow_id
      //   }
      // })
      // let data = {
      //   stage_id: stage_id,
      //   workflow_id: workflow_id,
      //   add: [],
      //   remove: []
      // }
      // for(const pg of params.group) {
      //   const match = stagegroup.group.find(x => x.code === pg.code)
      //   if(match) {
      //     // stagegroup.group = stagegroup.group.filter((g) => g.id !== match.id)
      //     // если группу исключили из стадии
      //     if(!pg.check) {
      //       const delGroup = stagegroup.group.filter((g) => g.id === match.id)
      //       // Удаляем пользователей из группы
      //       const user = await this.workflowStageGroupUserRepository.find({
      //         where: {
      //           workflow_stage_group: +delGroup[0].id
      //         }
      //       })
      //       await this.workflowStageGroupUserRepository.remove(user)
      //       // Удаляем группу
      //       const group = await this.workflowStageGroupRepository.find({
      //         where: {
      //           id: +delGroup[0].id
      //         }
      //       })
      //       const removeGroup = await this.workflowStageGroupRepository.remove(group)
      //       data.remove.push(removeGroup[0])
      //     }
      //   } else {
      //     // если группу добавили в стадию
      //     if(pg.check) {
      //       const getGroupByCode = groupDefault.data.find(x => x.code === pg.code)
      //       // получаем группу в стадии с максимальным порядком выполнения, чтобы добавить новую группу после нее
      //       const maxGroupInStage = await this.workflowStageGroupRepository.findOne({
      //         where: {
      //           workflow_id: pg.workflow_id,
      //           stage_id: pg.stage_id
      //         },
      //         order: {
      //           order_execution_group: 'DESC'
      //         }
      //       })
      //       let newOrderExecutionGroup = 0, newHierarchy = '0.0'
      //       if(maxGroupInStage) {
      //         // Высчитываем новый порядок выполнения
      //         newOrderExecutionGroup = +maxGroupInStage.order_execution_group+1
      //         // Высчитываем новую иерархию
      //         const maxHierarchy = maxGroupInStage.hierarchy.split('.')
      //         const newSubHierarchy = +maxHierarchy[1]+1
      //         newHierarchy = maxHierarchy[0]+'.'+newSubHierarchy
      //       }
      //       // Добавляем
      //       const addGroup = await this.workflowStageGroupRepository.create({
      //         code: getGroupByCode.code,
      //         name_ru: getGroupByCode.name_ru,
      //         name_en: getGroupByCode.name_en,
      //         type_id: getGroupByCode.type_id,
      //         order_execution_group: newOrderExecutionGroup,
      //         hierarchy: newHierarchy,
      //         stage_id: stage_id,
      //         workflow_id: workflow_id,
      //         deadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
      //       })
      //       const newGroup = await this.workflowStageGroupRepository.save(addGroup)
      //       // После добавления группы добавляем в нее пользователей из таблицы по умолчанию
      //       getGroupByCode.user_group.forEach((u) => {
      //         const newGroupUser = this.workflowStageGroupUserRepository.create({
      //           full_name: u.user.full_name,
      //           email: u.user.email,
      //           department: u.user.department,
      //           position: u.user.position,
      //           role: u.user.role,
      //           workflow_id: workflow_id,
      //           workflow_stage_group: newGroup,
      //           order_execution_user: 1, // TODO
      //           hierarchy: '1', // TODO
      //           stage_id: newGroup.stage_id,
      //           group_id: newGroup.id
      //         })
      //         this.workflowStageGroupUserRepository.save(newGroupUser)
      //       })
      //       data.add.push(newGroup)
      //     }
      //   }
      // }

      // return data
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

    // Обновление типа
    async updateType(params) {
      const type_id = params.type_id,
            workflow_id = params.workflow_id
      const type = await this.workflowStageTypeRepository.findOne(type_id)
      type.type_id = +params.subtype_id
      const data = await this.workflowStageTypeRepository.save(type)
      return {
        success: true,
        data: data
      }
    }

    // Обновление пользовательской сортировки групп для маршрута по умолчанию
    async setSortDefaultWorkflowElement(params) {
      try {
        // Обновляем иерархию стадий
        params.params.stages.forEach(async (p_stage, p_stage_idx) => {
          const stage_wf = await this.defaultWorkflowStageRepository.findOne(p_stage.id)
          stage_wf.order_execution_stage = p_stage.order_execution_stage
          stage_wf.hierarchy = p_stage.hierarchy
          await this.defaultWorkflowStageRepository.save(stage_wf)
        })
        // Обновляем иерархию типов
        params.params.types.forEach(async (p_type, p_type_idx) => {
          const type_wf = await this.defaultWorkflowStageTypeRepository.findOne(p_type.id)
          type_wf.order_execution_type = p_type.order_execution_type
          type_wf.hierarchy = p_type.hierarchy
          await this.defaultWorkflowStageTypeRepository.save(type_wf)
        })
        // Обновляем иерархию групп
        params.params.groups.forEach(async (p_group, p_group_idx) => {
          const group_wf = await this.defaultWorkflowStageGroupRepository.findOne(p_group.id)
          group_wf.order_execution_group = p_group.order_execution_group
          group_wf.hierarchy = p_group.hierarchy
          await this.defaultWorkflowStageGroupRepository.save(group_wf)
        })
        // Обновляем иерархию пользователей
        params.params.users.forEach(async (p_user, p_user_idx) => {
          const user_wf = await this.defaultWorkflowStageGroupUserRepository.findOne(p_user.id)
          user_wf.order_execution_user = p_user.order_execution_user
          user_wf.hierarchy = p_user.hierarchy
          await this.defaultWorkflowStageGroupUserRepository.save(user_wf)
        })

        return {
          success: true,
          message: 'Data sorted successfully'
        }
      }
      catch(e) {
        return {
          success: false,
          message: e.toString(),
        }
      }
    }

    // Обновление пользовательской сортировки групп для индивидуального маршрута
    async setSortWorkflowElement(params) {
      try {
        // Обновляем иерархию стадий
        params.stages.forEach(async (p_stage, p_stage_idx) => {
          const stage_wf = await this.workflowStageRepository.findOne(p_stage.id)
          stage_wf.order_execution_stage = p_stage.order_execution_stage
          stage_wf.hierarchy = p_stage.hierarchy
          await this.workflowStageRepository.save(stage_wf)
        })
        // Обновляем иерархию типов
        params.types.forEach(async (p_type, p_type_idx) => {
          const type_wf = await this.workflowStageTypeRepository.findOne(p_type.id)
          type_wf.order_execution_type = p_type.order_execution_type
          type_wf.hierarchy = p_type.hierarchy
          await this.workflowStageTypeRepository.save(type_wf)
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

    // Добавление/удаление групп в стадии по умолчанию
    async editGroupInStage(params) {
      const stage_id = params.stage_id,
            type_id = params.type_id
      const groupDefault: any = await this.groupService.findAll();
      // const stagegroup: any = await this.defaultWorkflowStageRepository.findOne(stage_id, {
      //   relations: ['types', 'types.groups', 'types.groups.group']
      // })
      // Если добавляем группу в новый тип
      if(!type_id) {
        const check = params.group.find(i => i.check === true)
        // Если выбранна хоть одна группа на добавление
        if(check) {
          // Создаем тип для групп
          const createType = this.defaultWorkflowStageTypeRepository.create({
            order_execution_type: 99, // TODO
            hierarchy: '99.99', // TODO
            stage_id: stage_id
          })
          const newType = await this.defaultWorkflowStageTypeRepository.save(createType)
          for(const pg of params.group) {
            if(pg.check) {
              const getGroupByCode = groupDefault.data.find(x => x.code === pg.code)
              const addGroup = await this.defaultWorkflowStageGroupRepository.create({
                order_execution_group: 99,
                hierarchy: '99.99.99',
                stage_id: stage_id,
                type_id: newType.id,
                group_id: getGroupByCode.id,
                side_id: pg.side_id
              })
              const newGroup = await this.defaultWorkflowStageGroupRepository.save(addGroup)
              // После добавления группы добавляем в нее пользователей из таблицы по умолчанию
              getGroupByCode.user_group.forEach((u) => {
                const newGroupUser = this.defaultWorkflowStageGroupUserRepository.create({
                  stage_id: newGroup.stage_id,
                  type_id: newType.id,
                  group_id: newGroup.id,
                  user_id: u.user.id,
                  order_execution_user: 99, // TODO
                  hierarchy: '99.99.99.99', // TODO
                })
                this.defaultWorkflowStageGroupUserRepository.save(newGroupUser)
              })
            }
          }
        }
      }
      // Если в стадии уже есть тип и группа в нем
      else {
        const stagegrouptype: any = await this.defaultWorkflowStageTypeRepository
          .findOne(type_id, {
            relations: ['groups', 'groups.group']
          })
        for(const pg of params.group) {
          // Находим каждую группу из списка для получения полной информации
          const match = stagegrouptype.groups.find(x => x.group.code === pg.code)
          if(match) {
            // если группу исключили из стадии
            if(!pg.check) {
              const delGroup = stagegrouptype.groups.filter((g) => g.id === match.id)
              // Удаляем пользователей из группы
              const user = await this.defaultWorkflowStageGroupUserRepository.find({
                where: {
                  group_id: +delGroup[0].id
                }
              })
              await this.defaultWorkflowStageGroupUserRepository.remove(user)
              // Удаляем группу
              const group = await this.defaultWorkflowStageGroupRepository.find({
                where: {
                  id: +delGroup[0].id
                }
              })
              await this.defaultWorkflowStageGroupRepository.remove(group)
            }
          } else {
            // если группу добавили в стадию
            if(pg.check) {
              const getGroupByCode = groupDefault.data.find(x => x.code === pg.code)
              // получаем группу в стадии с максимальным порядком выполнения, чтобы добавить новую группу после нее
              const maxGroupInStage = await this.defaultWorkflowStageGroupRepository.findOne({
                where: {
                  type_id: pg.type_id,
                  stage_id: pg.stage_id
                },
                order: {
                  order_execution_group: 'DESC'
                }
              })
              // console.log(maxGroupInStage)
              let newOrderExecutionGroup = 0, newHierarchy = '0.0'
              if(maxGroupInStage) {
                // Высчитываем новый порядок выполнения
                newOrderExecutionGroup = +maxGroupInStage.order_execution_group+1
                // Высчитываем новую иерархию
                const maxHierarchy = maxGroupInStage.hierarchy.split('.')
                const newSubHierarchy = +maxHierarchy[1]+1
                newHierarchy = maxHierarchy[0]+'.'+newSubHierarchy
              }
              // Добавляем
              const addGroup = await this.defaultWorkflowStageGroupRepository.create({
                order_execution_group: newOrderExecutionGroup,
                hierarchy: newHierarchy,
                stage_id: stage_id,
                type_id: type_id,
                group_id: getGroupByCode.id,
                side_id: pg.side_id
              })
              const newGroup = await this.defaultWorkflowStageGroupRepository.save(addGroup)
              // После добавления группы добавляем в нее пользователей из таблицы по умолчанию
              getGroupByCode.user_group.forEach((u) => {
                const newGroupUser = this.defaultWorkflowStageGroupUserRepository.create({
                  stage_id: newGroup.stage_id,
                  type_id: newGroup.type_id,
                  group_id: newGroup.id,
                  user_id: u.user.id,
                  order_execution_user: 1, // TODO
                  hierarchy: '1', // TODO
                })
                this.defaultWorkflowStageGroupUserRepository.save(newGroupUser)
              })
            }
          }
        }
        // Проверям в конце, если из типа удалили последнюю группу, то тип надо тоже удалить
        const checkTypeEmpty: any = await this.defaultWorkflowStageTypeRepository
          .findOne(params.type_id, {
            relations: ['groups', 'groups.group']
          })
        if(checkTypeEmpty.groups.length === 0) {
          await this.defaultWorkflowStageTypeRepository.remove(checkTypeEmpty)
        }
      }
      return {
        success: true
      }
    }

    // Добавление/удаление групп в стадии
    async editWFGroupInStage(params) {
      const workflow_id = params.workflow_id,
            stage_id = params.stage_id,
            type_id = params.type_id
      const groupDefault: any = await this.groupService.findAll();
      // Если добавляем группу в новый тип
      if(!type_id) {
        const check = params.group.find(i => i.check === true)
        // Если выбранна хоть одна группа на добавление
        if(check) {
          // Создаем тип для групп
          const createType = this.workflowStageTypeRepository.create({
            order_execution_type: 99, // TODO
            hierarchy: '99.99', // TODO
            workflow_id: workflow_id,
            stage_id: stage_id
          })
          const newType = await this.workflowStageTypeRepository.save(createType)
          for(const pg of params.group) {
            if(pg.check) {
              const getGroupByCode = groupDefault.data.find(x => x.code === pg.code)
              const addGroup = await this.workflowStageGroupRepository.create({
                code: getGroupByCode.code,
                name_ru: getGroupByCode.name_ru,
                name_en: getGroupByCode.name_en,
                workflow_id: workflow_id,
                order_execution_group: 99,
                hierarchy: '99.99.99',
                stage_id: stage_id,
                type_id: newType.id,
                side_id: getGroupByCode.side_id
              })
              const newGroup = await this.workflowStageGroupRepository.save(addGroup)
              // После добавления группы добавляем в нее пользователей из таблицы по умолчанию
              getGroupByCode.user_group.forEach((u) => {
                const newGroupUser = this.workflowStageGroupUserRepository.create({
                  full_name: u.user.full_name,
                  login: u.user.login,
                  email: u.user.email,
                  department: u.user.department,
                  position: u.user.position,
                  role: u.user.role,
                  workflow_id: workflow_id,
                  stage_id: stage_id,
                  type_id: newType.id,
                  group_id: newGroup.id,
                  order_execution_user: 99, // TODO
                  hierarchy: '99.99.99.99', // TODO
                })
                this.workflowStageGroupUserRepository.save(newGroupUser)
              })
            }
          }
        }
      }
      // Если в стадии уже есть тип и группа в нем
      else {
        const stagegrouptype: any = await this.workflowStageTypeRepository
          .findOne(type_id, {
            relations: ['groups']
          })
        for(const pg of params.group) {
          // Находим каждую группу из списка для получения полной информации
          const match = stagegrouptype.groups.find(x => x.code === pg.code)
          if(match) {
            // если группу исключили из стадии
            if(!pg.check) {
              const delGroup = stagegrouptype.groups.filter((g) => g.id === match.id)
              // Удаляем пользователей из группы
              const user = await this.workflowStageGroupUserRepository.find({
                where: {
                  group_id: +delGroup[0].id
                }
              })
              await this.workflowStageGroupUserRepository.remove(user)
              // Удаляем группу
              const group = await this.workflowStageGroupRepository.find({
                where: {
                  id: +delGroup[0].id
                }
              })
              await this.workflowStageGroupRepository.remove(group)
            }
          } else {
            // если группу добавили в стадию
            if(pg.check) {
              const getGroupByCode = groupDefault.data.find(x => x.code === pg.code)
              // получаем группу в стадии с максимальным порядком выполнения, чтобы добавить новую группу после нее
              const maxGroupInStage = await this.workflowStageGroupRepository.findOne({
                where: {
                  workflow_id: workflow_id,
                  type_id: pg.type_id,
                  stage_id: pg.stage_id
                },
                order: {
                  order_execution_group: 'DESC'
                }
              })
              // console.log(maxGroupInStage)
              let newOrderExecutionGroup = 0, newHierarchy = '0.0.0'
              if(maxGroupInStage) {
                // Высчитываем новый порядок выполнения
                newOrderExecutionGroup = +maxGroupInStage.order_execution_group+1
                // Высчитываем новую иерархию
                const maxHierarchy = maxGroupInStage.hierarchy.split('.')
                const newSubHierarchy = +maxHierarchy[2]+1
                newHierarchy = maxHierarchy[0]+'.'+maxHierarchy[1]+'.'+newSubHierarchy
              }
              // Добавляем
              const addGroup = await this.workflowStageGroupRepository.create({
                code: getGroupByCode.code,
                name_ru: getGroupByCode.name_ru,
                name_en: getGroupByCode.name_en,
                workflow_id: workflow_id,
                order_execution_group: newOrderExecutionGroup,
                hierarchy: newHierarchy,
                stage_id: stage_id,
                type_id: type_id,
                side_id: getGroupByCode.side_id
              })
              const newGroup = await this.workflowStageGroupRepository.save(addGroup)
              // После добавления группы добавляем в нее пользователей из таблицы по умолчанию
              getGroupByCode.user_group.forEach((u) => {
                const newGroupUser = this.workflowStageGroupUserRepository.create({
                  full_name: u.user.full_name,
                  login: u.user.login,
                  email: u.user.email,
                  department: u.user.department,
                  position: u.user.position,
                  role: u.user.role,
                  workflow_id: workflow_id,
                  stage_id: stage_id,
                  type_id: type_id,
                  group_id: newGroup.id,
                  order_execution_user: 99, // TODO
                  hierarchy: '99.99.99.99', // TODO
                })
                this.workflowStageGroupUserRepository.save(newGroupUser)
              })
            }
          }
        }
        // Проверям в конце, если из типа удалили последнюю группу, то тип надо тоже удалить
        const checkTypeEmpty: any = await this.workflowStageTypeRepository
          .findOne(params.type_id, {
            relations: ['groups']
          })
        if(checkTypeEmpty.groups.length === 0) {
          await this.workflowStageTypeRepository.remove(checkTypeEmpty)
        }
      }
      return {
        success: true
      }
    }

    async updateGroupType(params) {
      // const group_id = params.group_id
      // const group: any = await this.defaultWorkflowStageGroupRepository.findOne(group_id, {
      //   relations: ['group']
      // })
      // const paramsForDefault = {
      //   group_id: group.group.id,
      //   group_type: params.group_type
      // }
      // const data = await this.groupService.onUpdateGroupType(paramsForDefault)
      // return data
      const type_id = params.type_id
      const type = await this.defaultWorkflowStageTypeRepository.findOne(type_id)
      type.type_id = +params.subtype_id
      const data = await this.defaultWorkflowStageTypeRepository.save(type)
      return {
        success: true,
        data: data
      }
    }
    // Пользователи в группе
    async getUserInGroup(id) {
      const data = await this.defaultWorkflowStageGroupRepository.findOne(id, {
        relations: ['group', 'users', 'users.user']
      })
      return {
        success: true,
        data: data
      }
    }
    async getUserInGroupWF(id) {
      const data = await this.workflowStageGroupRepository.findOne(id, {
        relations: ['users']
      })
      return {
        success: true,
        data: data
      }
    }
    // Поиск в ADFS
    async searchUserADFS(query) {
      const token = await this.tokenService.checkDBToken('databus');

      const urlencoded = new URLSearchParams()
      urlencoded.append('', query)
      const headersRequest = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token.token}`,
      };

      const url = this.configService.get('databus_url')
      const search = await this.http.post(
        `${url}/api/users/find`,
        urlencoded,
        { headers: headersRequest }
      )
      .toPromise()
      .then((resp) => {
        if(resp.data.success) {
          return resp.data.users
        }
        else {
          return resp.data.message ? resp.data.message : resp.data.Message
        }
      })

      return {
        data: search,
        isFound: Array.isArray(search)
      }
    }

    // Добавление пользователя в группу
    async addUserInGroup(params) {
      // Проверяем, есть ли уже пользователь в таблице user
      let modelToAdd = {
        user_id: [],
        group_id: []
      }
      for(let user of params.add_users) {
        const checkUser = await this.userRepository.findOne({
          where: {
            email: user.Email
          }
        })
        // Если нет, то добавляем
        if(!checkUser) {
          const addUser = await this.userRepository.create({
            uuid: user.Id,
            full_name: user.DisplayName,
            login: user.UserName,
            email: user.Email,
            department: user.Department,
            position: user.Position
          })
          const newUser = await this.userRepository.save(addUser)
          modelToAdd.user_id.push(newUser.id)
        } else { modelToAdd.user_id.push(checkUser.id) }
      }
      // Если добавляем в маршрут по умолчанию, то автоматом добавляем каскадно (во все идентичные группы каждой стадии)
      if(!params.workflow_id) {
        // Добавляем в модель user_group
        const group = await this.groupService.findGroupByCode(params.group_code)
        for(let user of modelToAdd.user_id) {
          // Нет ли уже пользователя в группе
          const checkDoublicate = await this.userGroupRepository.findOne({
            where: {
              user_id: user,
              group_id: group.id
            }
          })
          // Если нет, то добавляем
          if(!checkDoublicate) {
            const newUser = await this.userGroupRepository.create({
              user_id: user,
              group_id: group.id
            })
            await this.userGroupRepository.save(newUser)
          }
        }
        // Добавляем в модель workflow
        const defGroup = await this.defaultWorkflowStageGroupRepository
          .createQueryBuilder('def_group')
          .leftJoinAndSelect('def_group.group', 'group')
          .leftJoinAndSelect('def_group.users', 'users')
          .leftJoinAndSelect('users.user', 'user')
          .where('group.code = :group_code', {group_code: params.group_code})
          .getMany()
        for(let group of defGroup) {
          for(let user of modelToAdd.user_id) {
            // Нет ли уже пользователя в группе
            const checkDoublicate = await this.defaultWorkflowStageGroupUserRepository.findOne({
              where: {
                stage_id: group.stage_id,
                user_id: user,
                group_id: group.id
              }
            })
            // Если нет, то добавляем
            if(!checkDoublicate) {
              const create = await this.defaultWorkflowStageGroupUserRepository.create({
                stage_id: group.stage_id,
                type_id: group.type_id,
                group_id: group.id,
                user_id: user,
                order_execution_user: 999, // TODO
                hierarchy: '999.999.999' // TODO
              })
              await this.defaultWorkflowStageGroupUserRepository.save(create)
            }
          }
          modelToAdd.group_id.push(group.id)
        }
      }
      // console.log(modelToAdd)
      return {
        success: true
      }
    }

    // Добавление пользователя в группу WF
    async addUserInGroupWF(params) {
      // Проверяем, есть ли уже пользователь в таблице user
      let modelToAdd = {
        user_id: [],
        group_id: []
      }
      for(let user of params.add_users) {
        const checkUser = await this.workflowStageGroupUserRepository.findOne({
          where: {
            email: user.Email,
            group_id: params.group_id,
            type_id: params.type_id,
            stage_id: params.stage_id,
            workflow_id: params.workflow_id
          }
        })
        // Если нет, то добавляем
        if(!checkUser) {
          const addUser = await this.workflowStageGroupUserRepository.create({
            uuid: user.Id,
            full_name: user.DisplayName,
            login: user.UserName,
            email: user.Email,
            department: user.Department,
            position: user.Position,
            group_id: params.group_id,
            type_id: params.type_id,
            stage_id: params.stage_id,
            workflow_id: params.workflow_id,
            order_execution_user: 999, // TODO
            hierarchy: '999.999.999' // TODO
          })
          const newUser = await this.workflowStageGroupUserRepository.save(addUser)
          modelToAdd.user_id.push(newUser.id)
        } else { modelToAdd.user_id.push(checkUser.id) }
      }
      return {
        success: true
      }
    }

    // Удаление пользователя из группы
    async delUserInGroup(params) {
      const userDef = await this.userRepository.findOne(+params.user_orig_id)
      // Маршрут по умолчанию
      if(!params.workflow_id) {
        // Удаляем из модели workflow (каскадно)
        const defGroup = await this.defaultWorkflowStageGroupRepository
          .createQueryBuilder('def_group')
          .leftJoinAndSelect('def_group.group', 'group')
          .leftJoinAndSelect('def_group.users', 'users')
          .leftJoinAndSelect('users.user', 'user')
          .where('group.code = :group_code', {group_code: params.group_code})
          .getMany()
        for(let group of defGroup) {
          for(let user of group.users) {
            if(user.user['email'] === userDef.email) {
              await this.defaultWorkflowStageGroupUserRepository.delete({
                group_id: +group.id,
                user_id: +userDef.id
              })
            }
          }
        }
        // Удаляем из модели user_group
        const group = await this.groupService.findGroupByCode(params.group_code)
        const user_group = await this.userGroupRepository.findOne({
          where: {
            group_id: +group.id,
            user_id: +userDef.id
          }
        })
        await this.userGroupRepository.remove(user_group)
      }

      return {
        success: true
      }
    }

    // Удаление пользователя из группы WF
    async delUserInGroupWF(params) {
      const userWF = await this.workflowStageGroupUserRepository.findOne(params.user_id)
      await this.workflowStageGroupUserRepository.remove(userWF)
      return {
        success: true
      }
    }

    // Создание новой группы
    async createGroup(params) {
      let userId = null, userEmail
      // Создаем новую группу
      const createGroup = await this.groupRepository.create({
        code: params.params.code,
        name_ru: params.params.name_ru,
        name_en: params.params.name_en,
        type_id: params.params.type || 1,
        side_id: params.params.side
      })
      const newGroup = await this.groupRepository.save(createGroup)
      // Проверяем участников группы на наличие их в таблице пользователей
      for(let user of params.params.users) {
        const checkUser = await this.userRepository.findOne({
          where: {
            email: user.Email
          }
        })
        // Если их нет, то добавляем
        if(!checkUser) {
          const createUser = await this.userRepository.create(
            {
              uuid: user.Id,
              full_name: user.DisplayName,
              login: user.UserName,
              email: user.Email,
              department: user.Department,
              position: user.Position
            }
          )
          const newUser = await this.userRepository.save(createUser)
          userId = newUser.id
          userEmail = newUser.email
        } else {
          userId = checkUser.id
          userEmail = checkUser.email
        }
        // Привязываем участников к новой группе
        const newUserGroup = await this.userGroupRepository.create({
          user_id: userId,
          group_id: newGroup.id
        })
        await this.userGroupRepository.save(newUserGroup)
      }
      return {
        success: true
      }
    }

    // Удаление группы
    async deleteGroup(params) {
      await this.userGroupRepository.delete({
        group_id: params.group_id
      })

      await this.groupRepository.delete({
        id: params.group_id
      })

      return {
        success: true
      }
    }

    // Запуск согласования
    async start(wf_id, stage_code) {
      const wf = await this.workflowRepository.findOne(wf_id)
      // Проверяем, был ли уже запущен процесс
      const checkStarted = await this.workflowRepository.findOne(wf_id)
      if(!checkStarted.started) {
        // Находим следующую стадию выполнения
        const exec_stage = wf.current_stage
        // Проверяем, есть ли следующая стадия
        const checkNextStage = await this.workflowStageRepository.findOne({
          where: {
            workflow_id: wf_id,
            order_execution_stage: exec_stage+1
          }
        })
        // Если есть следующая стадия, то ставим ее
        if(checkNextStage) {
          await this.workflowRepository.update(wf_id, {
            current_stage: checkNextStage.order_execution_stage
          })
        }
        // Индикатор WF
        await this.workflowRepository.update(wf_id, {
          started: true
        })
        // Индикатор Stage
        await this.workflowStageRepository.update({
          workflow_id: wf_id,
          order_execution_stage: checkNextStage.order_execution_stage
        }, {
          action: true
        })
      } // Если WF уже выполняется
      else {
        // Находим порядковый номер стадии
        const stage = await this.workflowStageRepository.findOne({
          where: {
            workflow_id: wf_id,
            code: stage_code
          }
        })
        await this.workflowRepository.update(wf_id, {
          current_stage: stage.order_execution_stage,
          started: stage.order_execution_stage === 1 ? false : true
        })
        // Индикатор Stage у прошлого
        await this.workflowStageRepository.update({
          workflow_id: wf_id,
          order_execution_stage: wf.current_stage
        }, {
          action: false
        })
        // Индикатор Stage у нового
        await this.workflowStageRepository.update({
          workflow_id: wf_id,
          order_execution_stage: stage.order_execution_stage
        }, {
          action: true
        })
      }
    }

    // Удаление WF
    async deleteWF(wf_id) {
      await this.workflowRepository.delete({
        id: wf_id
      })
    }
}