import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '@src/group/entity/group.entity';
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';
import { SideEntity } from '@src/group/entity/side.entity';
import { GroupService } from '@src/group/group.service';
import { GroupController } from '@src/group/group.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity,
      GroupTypeEntity,
      SideEntity
    ])
  ],
  providers: [
    GroupService
  ],
  controllers: [
    GroupController
  ],
  exports: [
    GroupService
  ]
})
export class GroupModule {}