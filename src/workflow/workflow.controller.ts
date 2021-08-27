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

  // Маршрут согласования по умолчанию
  @Get('/defaultworkflow')
  async getDefaultWorkflow() {
    return await this.workflowService.getDefaultWorkflow()
  }

  // Сортировка маршрута по умолчанию
  @Post('/sortdefaultworkflowelement')
  async setSortWorkflowElement(@Body() body: Object) {
    return this.workflowService.setSortDefaultWorkflowElement(body)
  }
}