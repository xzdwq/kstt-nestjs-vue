import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from "@nestjs/common";

import { WorkflowService } from '@src/workflow/workflow.service';

@Controller('api')
export class WorkflowController {
  constructor(
    private workflowService: WorkflowService
  ){}

  @Get('/defaultworkflow')
  async getDefaultWorkflow() {
    return await this.workflowService.getDefaultWorkflow()
  }
}