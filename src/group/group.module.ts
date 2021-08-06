import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '@src/group/entity/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity
    ])
  ],
  providers: [
  ],
  controllers: [
  ],
})
export class GroupModule {}