import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DefaultWorkflowStageEntity } from "@src/workflow/entity/default/default_workflow_stage.entity";
import { DefaultWorkflowStageGroupEntity } from "@src/workflow/entity/default/default_workflow_stage_group.entity";
import { DefaultWorkflowStageGroupUserEntity } from "@src/workflow/entity/default/default_workflow_stage_group_user.entity";

import { WorkflowEntity } from '@src/workflow/entity/workflow.entity';
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';
import { WorkflowStageGroupEntity } from '@src/workflow/entity/workflow_stage_group.entity';
import { WorkflowStageGroupUserEntity } from '@src/workflow/entity/workflow_stage_group_user.entity';

import { WorkflowController } from '@src/workflow/workflow.controller'
import { WorkflowService } from '@src/workflow/workflow.service';

import { GroupModule } from '@src/group/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DefaultWorkflowStageEntity,
      DefaultWorkflowStageGroupEntity,
      DefaultWorkflowStageGroupUserEntity,

      WorkflowEntity,
      WorkflowStageEntity,
      WorkflowStageGroupEntity,
      WorkflowStageGroupUserEntity
    ]),
    GroupModule
  ],
  providers: [
    WorkflowService
  ],
  controllers: [
    WorkflowController
  ],
  exports: [
    WorkflowService
  ]
})
export class WorkflowModule {}