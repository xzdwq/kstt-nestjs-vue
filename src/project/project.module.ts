import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from '@src/project/entity/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity
    ])
  ],
  providers: [
  ],
  controllers: [
  ],
})
export class ProjectModule {}