import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentStatusEntity } from '@src/status/document/entity/document_status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentStatusEntity
    ])
  ],
  providers: [
  ],
  controllers: [
  ],
})
export class DocumentStatusModule {}