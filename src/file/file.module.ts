import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileTypeEntity } from '@src/file/entity/file_type.entity';
import { ExcelToPDFService } from '@src/file/excel_to_pdf.service';
import { TokenService } from '@src/auth/token/token.service'
import { TokenEntity } from '@src/auth/token/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileTypeEntity,
      TokenEntity
    ]),
    HttpModule
  ],
  providers: [
    ExcelToPDFService,
    TokenService
  ],
  controllers: [
  ],
  exports: [
    ExcelToPDFService
  ]
})
export class FileModule {}