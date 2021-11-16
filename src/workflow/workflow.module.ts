import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DefaultWorkflowStageEntity } from "@src/workflow/entity/default/default_workflow_stage.entity";
import { DefaultWorkflowStageTypeEntity } from "@src/workflow/entity/default/default_workflow_stage_type.entity";
import { DefaultWorkflowStageGroupEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group.entity";
import { DefaultWorkflowStageGroupUserEntity } from "@src/workflow/entity/default/default_workflow_stage_type_group_user.entity";

import { WorkflowEntity } from '@src/workflow/entity/workflow.entity';
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';
import { WorkflowStageTypeEntity } from '@src/workflow/entity/workflow_stage_type.entity';
import { WorkflowStageGroupEntity } from '@src/workflow/entity/workflow_stage_type_group.entity';
import { WorkflowStageGroupUserEntity } from '@src/workflow/entity/workflow_stage_type_group_user.entity';

import { UserEntity } from '@src/user/entity/user.entity';
import { UserGroupEntity } from '@src/user/entity/user_group.entity'

import { WorkflowController } from '@src/workflow/workflow.controller'
import { WorkflowService } from '@src/workflow/workflow.service';

import { GroupModule } from '@src/group/group.module';
import { GroupEntity } from '@src/group/entity/group.entity';
import { AuthModule } from '@src/auth/auth.module'
import { UserService } from '@src/user/user.service';
import { RoleEntity } from '@src/user/entity/role.entity';
import { UserRoleEntity } from '@src/user/entity/user_role.entity';
import { SideEntity } from '@src/group/entity/side.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      DefaultWorkflowStageEntity,
      DefaultWorkflowStageTypeEntity,
      DefaultWorkflowStageGroupEntity,
      DefaultWorkflowStageGroupUserEntity,

      WorkflowEntity,
      WorkflowStageEntity,
      WorkflowStageTypeEntity,
      WorkflowStageGroupEntity,
      WorkflowStageGroupUserEntity,

      UserEntity,
      UserGroupEntity,
      GroupEntity,
      RoleEntity,
      UserRoleEntity,
      SideEntity
    ]),
    GroupModule,
    HttpModule,
    AuthModule
  ],
  providers: [
    WorkflowService,
    UserService
  ],
  controllers: [
    WorkflowController
  ],
  exports: [
    WorkflowService
  ]
})
export class WorkflowModule {}