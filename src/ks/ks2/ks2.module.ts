import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity';
import { KS2FileArchiveEntity } from '@src/ks/ks2/entity/file/ks2_file_archive.entity'
import { KS2FileExcelEntity } from '@src/ks/ks2/entity/file/ks2_file_excel.entity'
import { KS6aFilePdfEntity } from '@src/ks/ks2/entity/file/ks6a_file_pdf.entity'
import { KS2TotalSUMEntity } from '@src/ks/ks2/entity/sum/ks2_total_sum.entity'
import { KS2TotalSUMInclEntity } from "@src/ks/ks2/entity/sum/ks2_total_sum_incl.entity";
import { KS2FileOtherEntity } from "@src/ks/ks2/entity/file/ks2_file_other.entity";

import { KS2WorkflowEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow.entity";
import { KS2WorkflowTypeEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow_type.entity";
import { KS2WorkflowTypeGroupEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow_type_group.entity";
import { KS2WorkflowTypeGroupUserEntity } from '@src/ks/ks2/entity/workflow/ks2_workflow_type_group_user.entity';
import { KS2StatusEntity } from "@src/ks/ks2/entity/ks2_status.entity";
import { KS2FilePdfEntity } from "@src/ks/ks2/entity/file/ks2_file_pdf.entity";

import { KS2Controller } from '@src/ks/ks2/ks2.controller';
import { KS2Service } from '@src/ks/ks2/ks2.service';
import { ExcelToPDFService } from "@src/file/excel_to_pdf.service";
import { TokenService } from '@src/auth/token/token.service'
import { TokenEntity } from '@src/auth/token/token.entity';
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';
import { GroupEntity } from '@src/group/entity/group.entity';
import { UserService } from '@src/user/user.service';
import { UserEntity } from '@src/user/entity/user.entity';
import { RoleEntity } from '@src/user/entity/role.entity';
import { UserRoleEntity } from '@src/user/entity/user_role.entity';

import { KS3Service } from '@src/ks/ks3/ks3.service';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity';
import { GroupModule } from '@src/group/group.module';
import { WorkflowModule } from '@src/workflow/workflow.module';
import { MailingModule } from '@src/mailing/mailing.module';
import { MailingService } from '@src/mailing/mailing.service';
import { MailingEntity } from '@src/mailing/entity/mailing.entity';
import { NotificationModule } from '@src/notification/notification.module';
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';
import { KS2HistoryEntity } from "@src/ks/ks2/entity/history/ks2_history.entity";
import { SideEntity } from '@src/group/entity/side.entity';
import { KS2CommentsEntity } from '@src/ks/ks2/entity/history/ks2_comments.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KS2Entity,
      KS2FileArchiveEntity,
      KS2FileExcelEntity,
      KS6aFilePdfEntity,
      KS2TotalSUMEntity,
      KS2TotalSUMInclEntity,
      KS2WorkflowEntity,
      KS2WorkflowTypeEntity,
      KS2WorkflowTypeGroupEntity,
      KS2WorkflowTypeGroupUserEntity,
      TokenEntity,
      WorkflowStageEntity,
      KS2FileOtherEntity,
      GroupEntity,
      KS2StatusEntity,
      KS2FilePdfEntity,
      UserEntity,
      RoleEntity,
      UserRoleEntity,
      KS3Entity,
      MailingEntity,
      GroupTypeEntity,
      KS2HistoryEntity,
      SideEntity,
      KS2CommentsEntity
    ]),
    HttpModule,
    NestjsFormDataModule,
    GroupModule,
    WorkflowModule,
    MailingModule,
    NotificationModule
  ],
  providers: [
    KS2Service,
    ExcelToPDFService,
    TokenService,
    UserService,
    KS3Service,
    MailingService
  ],
  controllers: [
    KS2Controller
  ],
})
export class KS2Module {}