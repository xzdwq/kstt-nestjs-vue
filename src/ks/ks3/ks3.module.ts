import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KS3Entity } from '@src/ks/ks3/entity/ks3.entity';
import { KS3Controller } from '@src/ks/ks3/ks3.controller';
import { KS3Service } from '@src/ks/ks3/ks3.service';
import { GroupModule } from '@src/group/group.module';
import { WorkflowModule } from '@src/workflow/workflow.module';
import { UserService } from '@src/user/user.service';
import { UserEntity } from '@src/user/entity/user.entity';
import { RoleEntity } from '@src/user/entity/role.entity';
import { UserRoleEntity } from '@src/user/entity/user_role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KS3Entity,
      UserEntity,
      RoleEntity,
      UserRoleEntity
    ]),
    GroupModule,
    WorkflowModule
  ],
  providers: [
    KS3Service,
    UserService
  ],
  controllers: [
    KS3Controller
  ],
})
export class KS3Module {}