import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowEntity } from '@src/workflow/entity/workflow.entity';
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';
import { WorkflowStageGroupEntity } from '@src/workflow/entity/workflow_stage_group.entity';
import { WorkflowStageGroupUserEntity } from '@src/workflow/entity/workflow_stage_group_user.entity';
import { WorkflowService } from '@src/workflow/workflow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkflowEntity,
      WorkflowStageEntity,
      WorkflowStageGroupEntity,
      WorkflowStageGroupUserEntity
    ])
  ],
  providers: [
    WorkflowService
  ],
  controllers: [
  ],
  exports: [
    WorkflowService
  ]
})
export class WorkflowModule {}