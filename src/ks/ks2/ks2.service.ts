import {
  Inject,
  Injectable,
  LoggerService
} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Repository, IsNull, In } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

import { ConfigService } from '@nestjs/config';
import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity';
import { KS2FileArchiveEntity } from '@src/ks/ks2/entity/file/ks2_file_archive.entity'
import { KS2FileExcelEntity } from '@src/ks/ks2/entity/file/ks2_file_excel.entity'
import { KS6aFilePdfEntity } from '@src/ks/ks2/entity/file/ks6a_file_pdf.entity'
import { ExcelToPDFService } from "@src/file/excel_to_pdf.service";
import { KS2TotalSUMEntity } from '@src/ks/ks2/entity/sum/ks2_total_sum.entity'
import { KS2TotalSUMInclEntity } from "@src/ks/ks2/entity/sum/ks2_total_sum_incl.entity"
import { KS2FileOtherEntity } from "@src/ks/ks2/entity/file/ks2_file_other.entity";
import { KS2FilePdfEntity } from "@src/ks/ks2/entity/file/ks2_file_pdf.entity";

import { KS2WorkflowEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow.entity";
import { KS2WorkflowTypeEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow_type.entity";
import { KS2WorkflowTypeGroupEntity } from "@src/ks/ks2/entity/workflow/ks2_workflow_type_group.entity";
import { KS2WorkflowTypeGroupUserEntity } from '@src/ks/ks2/entity/workflow/ks2_workflow_type_group_user.entity';
import { WorkflowStageEntity } from '@src/workflow/entity/workflow_stage.entity';
import { GroupEntity } from '@src/group/entity/group.entity';
import { KS2StatusEntity } from "@src/ks/ks2/entity/ks2_status.entity";

import { KS3Service } from '@src/ks/ks3/ks3.service';
import { MailingService } from '@src/mailing/mailing.service';
import { UserService } from '@src/user/user.service';
import { NotificationService } from '@src/notification/notification.service';
import { GroupTypeEntity } from '@src/group/entity/group_type.entity';
import { KS2HistoryEntity } from "@src/ks/ks2/entity/history/ks2_history.entity";
import { KS2CommentsEntity } from '@src/ks/ks2/entity/history/ks2_comments.entity'


const xlsx = require("xlsx");
// const reader = require("xlsx")

@Injectable()
export class KS2Service {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private ks3Service: KS3Service,
    private mailingService: MailingService,
    private userService: UserService,
    private notificationService: NotificationService,
    // КС-2 акт
    @InjectRepository(KS2Entity)
    private ks2Repository: Repository<KS2Entity>,
    // Архив файлов привязанных к КС-2
    @InjectRepository(KS2FileArchiveEntity)
    private ks2FileArchiveRepository: Repository<KS2FileArchiveEntity>,
    // Excel файл КС-2
    @InjectRepository(KS2FileExcelEntity)
    private ks2FileExcelRepository: Repository<KS2FileExcelEntity>,
    // PDF файл КС-6а привязанный к КС-2
    @InjectRepository(KS6aFilePdfEntity)
    private ks6aFilePdfRepository: Repository<KS6aFilePdfEntity>,
    // Прочие файлы акта КС-2
    @InjectRepository(KS2FileOtherEntity)
    private ks2FileOtherRepository: Repository<KS2FileOtherEntity>,
    // PDF файл акта КС-2
    @InjectRepository(KS2FilePdfEntity)
    private ks2FilePdfRepository: Repository<KS2FilePdfEntity>,
    // Итоговые суммы акта КС-2
    @InjectRepository(KS2TotalSUMEntity)
    private ks2TotalSumRepository: Repository<KS2TotalSUMEntity>,
    // Итоговые суммы акта КС-2 в том числе
    @InjectRepository(KS2TotalSUMInclEntity)
    private ks2TotalSumInclRepository: Repository<KS2TotalSUMInclEntity>,
    // КС-2 workflow
    @InjectRepository(KS2WorkflowEntity)
    private ks2WorkflowRepository: Repository<KS2WorkflowEntity>,
    // КС-2 workflow типы групп
    @InjectRepository(KS2WorkflowTypeEntity)
    private ks2WorkflowTypeRepository: Repository<KS2WorkflowTypeEntity>,
    // КС-2 workflow группы
    @InjectRepository(KS2WorkflowTypeGroupEntity)
    private ks2WorkflowTypeGroupRepository: Repository<KS2WorkflowTypeGroupEntity>,
    // КС-2 workflow пользователи
    @InjectRepository(KS2WorkflowTypeGroupUserEntity)
    private ks2WorkflowTypeGroupUserRepository: Repository<KS2WorkflowTypeGroupUserEntity>,
    // Workflow репеозиторий стадий
    @InjectRepository(WorkflowStageEntity)
    private workflowStageRepository: Repository<WorkflowStageEntity>,
    // Репозиторий групп
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
    // Репозиторий статусов
    @InjectRepository(KS2StatusEntity)
    private ks2StatusRepository: Repository<KS2StatusEntity>,
    // Конфигурации
    @Inject(ConfigService)
    private configService: ConfigService,
    // Сервис файлов
    private excelToPDFService: ExcelToPDFService,
    // Типы групп
    @InjectRepository(GroupTypeEntity)
    private groupTypeRepository: Repository<GroupTypeEntity>,
    // История КС-2
    @InjectRepository(KS2HistoryEntity)
    private ks2HistoryRepository: Repository<KS2HistoryEntity>,
    // Комментарии участников согласования
    @InjectRepository(KS2CommentsEntity)
    private ks2CommentsRepository: Repository<KS2CommentsEntity>,
  ) {}

  // Загрузка Excel КС-2
  async uploadKS2File(body, author) {

    /**
     * Парсинг excel файла
     */
    const workBook = xlsx.read(body.file.buffer, {
        raw: false,
        header: 1,
        defval: null,
        cellDates: true,
        dateNF: 'yyyy-mm-dd',
        blankrows: false
      });
    const workSheet = workBook.Sheets[workBook.SheetNames[0]]

    let data: any = {},
        headers: any = { rows: [], lastCharCol: null },
        dataTotal = [],
        rowStamp = { row: null, cell: null, coorRow: null, coorCell: null }

    data.user_id = author.DB.id;
    data.ks3_id = +body.ks3_id;
    // Записываем метаданные из Excel
    for(let cell in workSheet) {
      const cellString = cell.toString()
      // Договор подряда - subcontract_number
      if(new String(workSheet[cell].v).includes('Договор подряда')) {
        const subcontract_number = await this.getRowToRowEndDataExcel(workSheet, cellString, 'number')
        data.subcontract_number = subcontract_number.value
        // Дата подряда - subcontract_date (из ячецки ниже)
        const currentChar = subcontract_number.cell.match(/[^0-9]+/)[0]
        const nextNum = +subcontract_number.cell.match(/\d+/)[0] + 1
        const subcontractDateCell = currentChar+nextNum
        let dateCall, dd
        if(typeof workSheet[subcontractDateCell].v === 'object') {
          dd = workSheet[subcontractDateCell].v
          dd.setHours(dd.getHours() + 3)
        } else {
          dateCall = workSheet[subcontractDateCell].v.split('.')
          dd = new Date(dateCall[1]+'/'+dateCall[0]+'/'+dateCall[2])
        }
        data.subcontract_date = dd
      }
      // Номер документа - document_number
      if(new String(workSheet[cell].v).includes('Номер документа')) {
        const currentChar = cellString.match(/[^0-9]+/)[0]
        const nextNum = +cellString.match(/\d+/)[0] + 2
        const documentNumberCell = currentChar+nextNum
        // data.document_number = workSheet[documentNumberCell].v
        const dateRow = await this.getRowToRowEndDataExcel(workSheet, documentNumberCell, null)
        data.document_number = dateRow[0]
        // Дата составления - date_preparation
        let dateCall, dd
        if(typeof dateRow[1] === 'object') {
          dd = dateRow[1]
          dd.setHours(dd.getHours() + 3)
        } else {
          dateCall = dateRow[1].split('.')
          dd = new Date(dateCall[1]+'/'+dateCall[0]+'/'+dateCall[2])
        }
        data.date_preparation = dd
        // Отчетный период - reporting_period
        let dateCall2, dd2
        if(typeof dateRow[2] === 'object') {
          dd2 = dateRow[1]
          dd2.setHours(dd2.getHours() + 3)
        } else {
          dateCall2 = dateRow[2].split('.')
          dd2 = new Date(dateCall2[1]+'/'+dateCall2[0]+'/'+dateCall2[2])
        }
        data.reporting_period = dd2
      }
      // Номер сметы
      if(new String(workSheet[cell].v).includes('Смета/')) {
        const dateRow = await this.getRowToRowEndDataExcel(workSheet, cellString, null)
        const estimate_durty = dateRow[1]
        // Локальный номер сметы
        const local_estimate_number = estimate_durty.match(/(?<=\№+\s|\№)(.*?)(?=\s)/gi)[1]
        data.estimate_number = estimate_durty
        // Берем номер ККС, ревизию и код здания из номера сметы
        const match = estimate_durty.match(/(?=AKU)(.*?)(?<=(\)|\).|\.\s))/gi),
              revision = match[0].match(/(?<=\(|\_|\s)(.*?)(?=\)|\.)/gi)[0],
              kks = match[0].match(/(?=AKU)(.*?)(?=\(|\_|\s)/gi)[0],
              building_code = estimate_durty.match(/(?<=\()(\w{5})(?=\))/gi)[0]

        data.estimate_local_number = local_estimate_number
        data.revision = revision
        data.kks = kks
        data.building_code = building_code
      }
      // Проверка на дубликат по номеру сметы и номеру документа
      const matchExcelData = await this.ks2Repository.findOne({
        where: {
          document_number: data.document_number,
          estimate_number: data.estimate_number
        }
      })
      if(matchExcelData) {
        return {
          success: false,
          message_en: 'Duplicate. The system already has a document with these data',
          message_ru: 'Дубликат. В системе уже есть документ с такими данными',
          data: matchExcelData
        }
      }
      // Headers
      if(new String(workSheet[cell].v).includes('№ п/п')) {
        /**
         * Получить данные из диапазона
         * @param {excelWorkSheet} - лист (книга) Excel
         * @param {cellStart} - ячейка с которой начнется считываение данных
         * @param {breackWord} - точное слово по достижению которого прервется считывание данных
         */
        const hdrs = await this.getRangeDataExcel(workSheet, cellString, '1')
        const headerAndCode = await this.setHeaderCode(hdrs)
        headers.rows = headerAndCode
        // Получаем последнюю букву колонки
        headers.lastCharCol = headers.rows[headers.rows.length - 1].cellChar
      }
      // Суммы
        // Итого прямые затраты (ПЗ) по акту в текущих ценах, в т.ч./Total direct costs (DC) on Certificate in current prices, incl.:
      if(new String(workSheet[cell].v).includes('Итого прямые затраты')) {
        // const dataTotal = await this.getRangeDataExcel(workSheet, cellStartTotal, 'М.П./L.S.')
        /**
         * Получить данные из диапозона строки
         * @param {excelWorkSheet} - лист (книга) Excel
         * @param {cellStart: string} - ячейка с которой начнется считываение данных
         * @param {cellEnd: string} - ячейка с которой прерывается считываение данных
         * @param {header: array} - столбцы с координатами ячеек
         * @param {label_code: string} - код наименования слева
         * @param {label_raw: string} - наименование слева
         */
        const label_code = 'total_direct_costs'
        const total_direct_costs = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(total_direct_costs)
      }
        // строительные работы/construction works
      if(new String(workSheet[cell].v).includes('строительные работы')) {
        const label_code = 'construction_works'
        const construction_works = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(construction_works)
      }
        // монтажные работы/installation works
      if(new String(workSheet[cell].v).includes('монтажные работы')) {
        const label_code = 'installation_works'
        const installation_works = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(installation_works)
      }
        // оборудование/equipment
      if(new String(workSheet[cell].v).includes('оборудование')) {
        const label_code = 'equipment'
        const equipment = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(equipment)
      }
        // прочие работы и затраты/other works and costs
      if(new String(workSheet[cell].v).includes('прочие работы')) {
        const label_code = 'other_works_costs'
        const other_works_costs = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(other_works_costs)
      }
        // накладные расходы и прибыль (25% от ПЗ)/Overheads and profit (25 % from DC)
      if(new String(workSheet[cell].v).includes('накладные расходы')) {
        const label_code = 'overheads_profit'
        const overheads_profit = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(overheads_profit)
      }
        // Итого по акту с учетом НР и СП/Total on certificate considering Overheads and Estimated Profit
      if(new String(workSheet[cell].v).includes('Итого по акту с учетом НР')) {
        const label_code = 'total_act_OEP'
        const total_act_OEP = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(total_act_OEP)
      }
       // Оплата непредвиденных расходов и затрат, связанных с реализацией рисков Подрядчика / Contractor Risk Fee
      if(new String(workSheet[cell].v).includes('Оплата непредвиденных расходов')) {
        const label_code = 'contractor_risk'
        const contractor_risk = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(contractor_risk)
      }
        // Итого по акту / Total on certificate
      if(new String(workSheet[cell].v).includes('Итого по акту /')) {
        const label_code = 'total_act'
        const total_act = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(total_act)
      }
        // Итого по акту с учетом понижающего коэффициента 0,9318 / Certificate total with reduction coefficient 0,9318
      if(new String(workSheet[cell].v).includes('Итого по акту с учетом понижающего')) {
        const label_code = 'act_total_reduction_coefficient'
        const act_total_reduction_coefficient = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(act_total_reduction_coefficient)
      }
        // НДС 18% в соответствии с законодательством Турецкой Республики/VAT 18 % in accordance with the Law of Turkish Republic
      if(new String(workSheet[cell].v).includes('НДС 18% в соответствии')) {
        const label = 'vat_turkish'
        const vat_turkish = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label, workSheet[cell].v)
        dataTotal.push(vat_turkish)
      }
        // Итого по акту к оплате с учетом НДС 18%/Total on Certificate to be paid considering VAT 18 %
      if(new String(workSheet[cell].v).includes('Итого по акту к оплате с учетом')) {
        const label_code = 'total_certificate_paid'
        const total_on_certificate_paid = await this.getRowDataExcel(workSheet, cellString, headers.lastCharCol, headers.rows, label_code, workSheet[cell].v)
        dataTotal.push(total_on_certificate_paid)
      }
      // TODO
      // Находим место где начинаются подписи
      if(new String(workSheet[cell].v).includes('М.П.')) {
        // Получаем координаты, чтобы обрезать файл и отсечь все начиная со штампов подписи
        if(!rowStamp.cell) {
          const row = cellString.match(/[^\D]+/)[0]
          rowStamp = {
            row: row,
            cell: cellString,
            coorRow: xlsx.utils.decode_cell('A'+row),
            coorCell: xlsx.utils.decode_cell(cellString)
          }
        }
      }
    }
    // console.log(dataTotal[0])
    // console.log(headers, data)
    // console.log(rowStamp)

    /**
     * Запись данных в БД и сохранение в шару
   */
    const uuid = uuidv4(),
          ext = body.file.originalName.match(/[0-9a-z]+$/i)[0],
          fileName = uuid+'.'+ext
    let result, dir, path
    // Если грузим новый файл, а не обновляем
    if(!body.ks2_id) {
      // Присваиваем новой карточке КС-2 статус "Проект"
      const statusProject = await this.ks2StatusRepository.findOne({where: { code: 'project' }})
      data.ks2_status_id = statusProject.id
      const ks2 = await this.ks2Repository.create({...data})
      result = await this.ks2Repository.save(ks2)
      dir = 'ks3'+'/'+body.ks3_id+'/'+'ks2'+'/'+result.id
      path = dir+'/'+fileName
      // Создаем Workflow для новой КС-2
      await this.onCreateWorkflowKS2({
        creator: author.Email,
        ks2_id: result.id,
        ks3_id: result.ks3_id,
        ks3_workflow_id: body.workflow_id
      })

      // Записываем итоговые суммы
      /* 
       * Каждый элемент массива dataTotal это строка таблицы
       * Проходимся по каждой строке
      */
      let data_incl: any = {}
      for(let item of dataTotal) {
        // Записываем строку Итого ПЗ
        if(item.find(i => i.label_code === 'total_direct_costs')) {
          const total_direct_costs = await this.ks2TotalSumRepository.create({
            total: item.find(i => i.header_code === 'total')?.data || null,
            basic_salary: item.find(i => i.header_code === 'basic_salary')?.data || null,
            operation_mechanisms: item.find(i => i.header_code === 'operation_mechanisms')?.data || null,
            salary_mechanics: item.find(i => i.header_code === 'salary_mechanics')?.data || null,
            materials: item.find(i => i.header_code === 'materials')?.data || null,
            labor_workers: item.find(i => i.header_code === 'labor_workers')?.data || null,
            labor_mechanics: item.find(i => i.header_code === 'labor_mechanics')?.data || null,
            ks2_id: result.id,
            ks3_id: body.ks3_id,
            ks3_workflow_id: body.workflow_id
          })
          await this.ks2TotalSumRepository.save(total_direct_costs)
        }
        // Записываем суммы в том числе
        else {
          const incl = item.find(i => i.header_code === 'total')
          if(incl) data_incl[incl.label_code] = incl.data
        }
      }
      data_incl.ks2_id = result.id
      data_incl.ks3_id = body.ks3_id
      data_incl.ks3_workflow_id = body.workflow_id
      const incl = await this.ks2TotalSumInclRepository.create({...data_incl})
      await this.ks2TotalSumInclRepository.save(incl)

    }
    // Если грузим новую версию файла
    else {
      dir = 'ks3'+'/'+body.ks3_id+'/'+'ks2'+'/'+body.ks2_id
      path = dir+'/'+fileName
      result = { id: body.ks2_id }

      // Обновляем суммы из новой версии Excel
      let data_incl: any = {}
      for(let item of dataTotal) {
        // Записываем строку Итого ПЗ
        if(item.find(i => i.label_code === 'total_direct_costs')) {
          await this.ks2TotalSumRepository.update(
            { ks2_id: body.ks2_id },
            {
              total: item.find(i => i.header_code === 'total')?.data || null,
              basic_salary: item.find(i => i.header_code === 'basic_salary')?.data || null,
              operation_mechanisms: item.find(i => i.header_code === 'operation_mechanisms')?.data || null,
              salary_mechanics: item.find(i => i.header_code === 'salary_mechanics')?.data || null,
              materials: item.find(i => i.header_code === 'materials')?.data || null,
              labor_workers: item.find(i => i.header_code === 'labor_workers')?.data || null,
              labor_mechanics: item.find(i => i.header_code === 'labor_mechanics')?.data || null,
              ks2_id: result.id,
              ks3_id: body.ks3_id,
              ks3_workflow_id: body.workflow_id
            }
          )
        }
        // Записываем суммы в том числе
        else {
          const incl = item.find(i => i.header_code === 'total')
          if(incl) data_incl[incl.label_code] = incl.data
        }
      }
      data_incl.ks2_id = result.id
      data_incl.ks3_id = body.ks3_id
      data_incl.ks3_workflow_id = body.workflow_id
      const incl = await this.ks2TotalSumInclRepository.update(
        { ks2_id: body.ks2_id },
        {...data_incl}
      )
    }
      // Сохраняем файл
      const fileData = {
        uuid: uuid,
        file: body.file.buffer,
        dir: dir,
        path: path,
        name: body.file.originalName,
        ext: ext,
        size: +body.file.size
      }
      const file = await this.uploadFile(fileData)
      let dataToSave: any = {
        uuid: uuid,
        name: fileData.name,
        path: file.path,
        size: fileData.size,
        ext: fileData.ext,
        mimetype: body.file.mimetype,
        ks2_id: result.id,
        ks3_id: body.ks3_id,
        ks3_workflow_id: body.workflow_id,
        user_id: author.DB.id,
        version: 1
      }
      // Если грузим новую версию файла
      if(body.ks2_id) {
        // Обновляем версию
        const ks2_excel_id = +body.ks2_excel_id
        const lastVersion = await this.ks2FileExcelRepository.findOne(ks2_excel_id)
        dataToSave.version = +lastVersion.version + 1
        // Убираем индикатор актуальности у предыдущего файла
        await this.ks2FileArchiveRepository.update(
          { uuid: body.ks2_file_uuid },
          {
            actual: false,
            event_ru: `Обновил версию: ${author.DB.login}`,
            event_en: `Updated version: ${author.DB.login}`
          }
        )
      }
      // Для архива проставляем тип из таблицы file_type - Excel форма акта КС-2
      dataToSave.file_type_id = 3
      // Записываем в архив
      const createKS2File = await this.ks2FileArchiveRepository.create(dataToSave)
      const newKS2File = await this.ks2FileArchiveRepository.save(createKS2File)
      delete dataToSave.file_type_id
      // Если грузим новый файл, а не обновляем
      if(!body.ks2_id) {
        // Записываем в форму excel
        const createExcelForm = await this.ks2FileExcelRepository.create(dataToSave)
        await this.ks2FileExcelRepository.save(createExcelForm)
      }
      // Если грузим новую версию файла
      else {
        await this.ks2FileExcelRepository.update({ id: body.ks2_excel_id }, dataToSave)
      }
      // PDF
      const dataForPdf = {
        dataToSave: dataToSave,
        file: body.file,
        dir: fileData.dir+'/pdf',
        uuid_excel_file: fileData.uuid,
        version: 1
      }
      // Конвертируем excel в PDF (Remote метод), там же сохраняем в директорию
      const pdf: any = await this.excelToPDFService.onExcelToPDFRemote(dataForPdf)
      // Сохраняем в БД PDF
      if(pdf.success) {
        pdf.user_id = author.DB.id
        pdf.file_type_id = 4 // PDF форма акта КС-2
        // Если грузим новую версию файла
        if(body.ks2_id) {
          const lastVersion = await this.ks2FilePdfRepository.findOne({ where: { ks2_id: +body.ks2_id }})
          pdf.version = +lastVersion.version + 1
          const dataToUpdate = {
            uuid: pdf.uuid,
            name: pdf.name,
            path: pdf.path,
            size: pdf.size,
            ext: pdf.ext,
            version: pdf.version
          }
          await this.ks2FilePdfRepository.update({ id: lastVersion.id }, dataToUpdate)
          // Убираем индикатор актуальности у предыдущего файла
          await this.ks2FileArchiveRepository.update(
            { uuid: lastVersion.uuid },
            {
              actual: false,
              event_ru: `Обновил версию: ${author.DB.login}`,
              event_en: `Updated version: ${author.DB.login}`
            }
          )
        }
        // Если грузим новый файл, а не обновляем
        else {
          const createPdf = await this.ks2FilePdfRepository.create({...pdf})
          await this.ks2FilePdfRepository.save(createPdf)
        }
        // Сохраняем PDF в БД Архив
        const createPdfFile = await this.ks2FileArchiveRepository.create({...pdf})
        await this.ks2FileArchiveRepository.save(createPdfFile)
      }

    return {
      success: true,
      data: result,
      file: newKS2File
    }
  }

  // Устанавливаем заданным заголовкам коды совпадающие с наименованиями столбцов в таблице
  async setHeaderCode(headers) {
    let data = []
    for(let i of headers) {
      // "Общая/ Total"
      if(i.data.includes('Общая')) {
        data.push({
          name: i.data,
          cell: i.cell,
          cellChar: i.cellChar,
          code: 'total'
        })
      }
      // "Основная зарплата/ Basic salary"
      if(i.data.includes('Основная зарплата')) {
        data.push({
          name: i.data,
          cell: i.cell,
          cellChar: i.cellChar,
          code: 'basic_salary'
        })
      }
      // "Эксплуатация машин/ Operation of mechanisms"
      if(i.data.includes('Эксплуатация машин')) {
        data.push({
          name: i.data,
          cell: i.cell,
          cellChar: i.cellChar,
          code: 'operation_mechanisms'
        })
      }
      // "Зарплата машинистов/Salary of mechanics"
      if(i.data.includes('Зарплата машинистов')) {
        data.push({
          name: i.data,
          cell: i.cell,
          cellChar: i.cellChar,
          code: 'salary_mechanics'
        })
      }
      // "Материалы/ Materials"
      if(i.data.includes('Материалы')) {
        data.push({
          name: i.data,
          cell: i.cell,
          cellChar: i.cellChar,
          code: 'materials'
        })
      }
      // "Трудозатраты рабочих, чел.-ч/ Workers labour effort, manhour"
      if(i.data.includes('Трудозатраты рабочих')) {
        data.push({
          name: i.data,
          cell: i.cell,
          cellChar: i.cellChar,
          code: 'labor_workers'
        })
      }
      // "Трудозатраты машинистов, чел.-ч/ perators labour effort, manhour"
      if(i.data.includes('Трудозатраты машинистов')) {
        data.push({
          name: i.data,
          cell: i.cell,
          cellChar: i.cellChar,
          code: 'labor_mechanics'
        })
      }
    }
    return data
  }

  /*
  * Получение ранжированных данных из Excel
  * Способ получения построчно до конкретной ячейки
  */
  async getRowDataExcel(workSheet, cellStart, charEnd, header, label_code, label_raw) {
    // Диапазон данных
    let range = xlsx.utils.decode_range(workSheet['!ref']);

    let colStart = header[0].cellChar // Начинаем с первого стобца колонки (хотя можно сразу с K)
    let start = xlsx.utils.decode_cell(colStart+cellStart.replace(cellStart[0], '')) // A40 => { c: 10, r: 39 }
    let colStop = charEnd // Дальше столбца Q данные не берем
    let end = xlsx.utils.decode_cell(colStop+cellStart.replace(cellStart[0], '')) // Q40 => { c: 16, r: 39 }

    range.s = start
    range.e = end

    let C, R = range.s.r,
        data = []
    for(C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R }
      const dataCell = xlsx.utils.encode_cell(cell_address)
      try {
        if(workSheet[dataCell].v) {
          const hdr = header.find(i => i.cellChar === dataCell.match(/[^0-9]+/)[0])
          data.push({
            cell: dataCell,
            data: workSheet[dataCell].w === '#REF!' ? null : +workSheet[dataCell].v,
            header_code: hdr.code,
            header_raw: hdr.name,
            label_code: label_code,
            label_raw: label_raw
          })
        }
      } catch(e) {}
    }
    return data
  }

  /*
  * Получение ранжированных данных из Excel
  * Универсальный способ до слова маркера прерывания
  */
  async getRangeDataExcel(workSheet, cellStart, breakMarker) {
    // Диапазон данных
    let range = xlsx.utils.decode_range(workSheet['!ref']);
    let start = xlsx.utils.decode_cell(cellStart)
    range.s = start;
    let data = [],
        abort = false
    for(let R = range.s.r; R <= range.e.r && !abort; ++R) {
      for(let C = range.s.c; C <= range.e.c && !abort; ++C) {
        const cell_address = { c: C, r: R }
        const dataCell = xlsx.utils.encode_cell(cell_address)

        // Проверяем на наличие данных
        try {
          // Выходим из циклов как только доходим до заданного маркера
          if(workSheet[dataCell].v.toString() === breakMarker) {
            abort = true
            break
          }
          data.push({
            data: workSheet[dataCell].v,
            cell: dataCell,
            cellChar: dataCell.match(/[^0-9]+/)[0]
          })
        } catch(e) {}
      }
    }
    // сортируем в алфавитном порядке столбцы excel
    data = data.sort((a, b) => a.cellChar.localeCompare(b.cellChar))
    return data
  }

  // Получение данных до конца строки
  async getRowToRowEndDataExcel(workSheet, cellStart, type) {
    // Диапазон данных
    let range = xlsx.utils.decode_range(workSheet['!ref']);
    let start = xlsx.utils.decode_cell(cellStart)
    range.s = start

    let C, R = range.s.r,
        data:any = {}, arr = []
    for(C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R }
      const dataCell = xlsx.utils.encode_cell(cell_address)
      if(workSheet[dataCell]) {
        if(type) {
          if(typeof workSheet[dataCell].v === type) {
            data.value = workSheet[dataCell].v
            data.cell = dataCell
            break
          }
        } else {
          arr.push(workSheet[dataCell].v)
        }
      }
    }
    if(type) return data
    return arr
  }

  // Загрузка КС-6а PDF формы
  async uploadKS6aFile(body, author) {
    const uuid = uuidv4(),
          ext = body.file.originalName.match(/[0-9a-z]+$/i)[0],
          fileName = uuid+'.'+ext

    const dir = 'ks3'+'/'+body.ks3_id+'/'+'ks2'+'/'+body.ks2_id+'/'+'ks6a'
    const path = dir+'/'+fileName
    // Сохраняем файл
    const fileData = {
      uuid: uuid,
      file: body.file.buffer,
      dir: dir,
      path: path,
      name: body.file.originalName,
      ext: ext,
      size: +body.file.size
    }
    const file = await this.uploadFile(fileData)
      let dataToSave: any = {
        uuid: uuid,
        name: fileData.name,
        path: file.path,
        size: fileData.size,
        ext: fileData.ext,
        mimetype: body.file.mimetype,
        ks2_id: body.ks2_id,
        ks3_id: body.ks3_id,
        ks3_workflow_id: body.workflow_id,
        user_id: author.DB.id,
        version: 1
      }
    // Если грузим новую версию файла
    if(body.ks6a_file_pdf_id) {
      // Обновляем версию
      const ks6a_file_pdf_id = +body.ks6a_file_pdf_id
      const lastVersion = await this.ks6aFilePdfRepository.findOne(ks6a_file_pdf_id)
      dataToSave.version = +lastVersion.version + 1
      // Убираем индикатор актуальности у предыдущего файла
      await this.ks2FileArchiveRepository.update(
        { uuid: body.ks6a_file_pdf_uuid },
        {
          actual: false,
          event_ru: `Обновил версию: ${author.DB.login}`,
          event_en: `Updated version: ${author.DB.login}`
        }
      )
    }
    // Для архива проставляем тип из таблицы file_type - PDF форма КС-6а
    dataToSave.file_type_id = 5
    // Записываем в архив
    const createKS2File = await this.ks2FileArchiveRepository.create(dataToSave)
    const newKS2File = await this.ks2FileArchiveRepository.save(createKS2File)
    delete dataToSave.file_type_id
    // Если грузим новый файл, а не обновляем
    if(!body.ks6a_file_pdf_id) {
      // Записываем в форму PDF
      const createPdfForm = await this.ks6aFilePdfRepository.create(dataToSave)
      await this.ks6aFilePdfRepository.save(createPdfForm)
    }
    /// Если грузим новую версию файла
    else {
      await this.ks6aFilePdfRepository.update({ id: body.ks6a_file_pdf_id }, dataToSave)
    }

    return {
      success: true,
      file: newKS2File
    }
  }

  // Сохранение файла
  async uploadFile(fileData) {
    const upload_location = this.configService.get('upload_location')
    const dir = upload_location+'/'+fileData.dir
    // Сначала создаем многовложенные папки всего пути под файл
    fs.mkdirSync(dir, { recursive: true });
    // Теперь сохраняем файл по пути
    const path = upload_location+'/'+fileData.path
    fs.writeFileSync(path, fileData.file);

    return {
      path: path,
      name: fileData.name,
      size: fileData.size
    }
  }

  // Создаем Workflow для КС-2
  async onCreateWorkflowKS2(data) {
    // console.log(data)
    // 1. Создаем новый КС-2 workflow и получаем его id
    // Т.к. у нас есть согласование КС-2 и Подписание КС-2, то создаем два процесса WF
    const ks2Stage = await this.workflowStageRepository.find({
      where: {
        code: In(['ks2_approv', 'ks2_sign']),
        workflow_id: data.ks3_workflow_id
      },
      order: {
        order_execution_stage: 'ASC'
      }
    })
    for(let stage of ks2Stage) {
      const ks2WF = await this.ks2WorkflowRepository.create({
        last_action_ru: 'Карточка создана для '+stage.code,
        last_action_en: 'Card created for '+stage.code,
        code: stage.code,
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        ks2_id: data.ks2_id,
        ks3_workflow_id: data.ks3_workflow_id,
        ks3_id: data.ks3_id
      })
      const newKS2WF = await this.ks2WorkflowRepository.save(ks2WF)
      // 2. Создаем новые типы будущих групп по логике как из таблицы по умолчанию
      // получаем типы из стадии "Согласование КС-2" индивидуального маршрута карточки КС-3
      const typeStageKS2: any = await this.workflowStageRepository
        .createQueryBuilder('stage')
        .leftJoinAndSelect('stage.types', 'types')
        .leftJoinAndSelect('types.groups', 'groups')
        .leftJoinAndSelect('groups.side', 'side')
        .leftJoinAndSelect('groups.users', 'users')
        .where('stage.code = :code', { code: stage.code })
        .andWhere('stage.workflow_id = :workflow_id', { workflow_id: data.ks3_workflow_id })
        .orderBy({
          'stage.order_execution_stage': 'ASC',
          'types.order_execution_type': 'ASC',
          'groups.order_execution_group': 'ASC'
        })
        .getOne()
      if(typeStageKS2.types.length > 0) {
        // Сортируем по порядку выполнения
        // typeStageKS2.types.sort((a, b) => a.order_execution_type < b.order_execution_type ? -1 : 1)
        for(let t of typeStageKS2.types) {
          // Записываем типы
          const ks2WFType = await this.ks2WorkflowTypeRepository.create({
            order_execution_type: t.order_execution_type,
            hierarchy: t.order_execution_type.toString(),
            ks2_workflow_id: newKS2WF.id,
            type_id: t.type_id,
            ks3_workflow_id: data.ks3_workflow_id
          })
          const newKs2WFType = await this.ks2WorkflowTypeRepository.save(ks2WFType)
          // Записываем группы
          for(let g of t.groups) {
            const hierarchySplit = g.hierarchy.split('.')
            const hierarchy = hierarchySplit[1]+'.'+hierarchySplit[2]
            const ks2WFTypeGroup = await this.ks2WorkflowTypeGroupRepository.create({
              code: g.code,
              name_ru: g.name_ru,
              name_en: g.name_en,
              deadline: g.deadline,
              ks2_workflow_id: newKS2WF.id,
              order_execution_group: g.order_execution_group,
              hierarchy: hierarchy,
              ks2_type_id: newKs2WFType.id,
              ks3_workflow_id: data.ks3_workflow_id,
              side_id: g.side_id
            })
            const newKs2WFTypeGroup = await this.ks2WorkflowTypeGroupRepository.save(ks2WFTypeGroup)
            // Записываем пользователей
            for(let u of g.users) {
              const ks2WFTypeGroup = await this.ks2WorkflowTypeGroupUserRepository.create({
                full_name: u.full_name,
                login: u.login,
                email: u.email,
                department: u.department,
                position: u.position,
                ks2_workflow_id: newKS2WF.id,
                ks2_type_id: newKs2WFType.id,
                ks2_group_id: newKs2WFTypeGroup.id,
                order_execution_user: u.order_execution_user,
                hierarchy: hierarchy+'.'+u.order_execution_user,
                ks3_workflow_id: data.ks3_workflow_id,
                creator: data.creator
              })
              await this.ks2WorkflowTypeGroupUserRepository.save(ks2WFTypeGroup)
            }
          }
        }
      }
    }
  }

  // Список статусов для КС-2
  async getKS2StatusList() {
    const data = await this.ks2StatusRepository.find()
    return {
      success: true,
      data: data
    }
  }

  // Список КС-2 привязанных к КС-3 id
  async getKS2ByKS3Id(params, author) {
    const limit = params.limit
    const page = params.page
    const id = params.id
    let sortIndex = params.sortIndex
    const sort = params.sort
    const filter = params.filter
    const searchIndex = params.searchIndex,
          search = params.search

    let queryB
    queryB = await this.ks2Repository
      .createQueryBuilder('ks2')
      .leftJoinAndSelect('ks2.ks2_workflow', 'ks2_workflow')
      .leftJoinAndSelect('ks2_workflow.ks2_types', 'ks2_types')
      .leftJoinAndSelect('ks2_types.ks2_groups', 'ks2_groups')
      .leftJoinAndSelect('ks2_groups.ks2_users', 'ks2_users')
      .leftJoinAndSelect('ks2.ks2_file_excel', 'ks2_file_excel')
      .leftJoinAndSelect('ks2_file_excel.user', 'excel_user')
      .leftJoinAndSelect('ks2.ks2_file_pdf', 'ks2_file_pdf')
      .leftJoinAndSelect('ks2_file_pdf.user', 'pdf_user')
      .leftJoinAndSelect('ks2.ks6a_file_pdf', 'ks6a_file_pdf')
      .leftJoinAndSelect('ks6a_file_pdf.user', 'ks6a_user')
      .leftJoinAndSelect('ks2.ks2_total_sum', 'ks2_total_sum')
      .leftJoinAndSelect('ks2.ks2_total_sum_incl', 'ks2_total_sum_incl')
      .leftJoinAndSelect('ks2.user', 'ks2_author')
      .leftJoinAndSelect('ks2.ks2_status', 'ks2_status')
      .where('ks2.ks3_id = :ks3_id', { ks3_id: id })

    if(filter && filter != 'all') {
      let codes = filter.split(',')
      const matchIndexRequestMyApprove = codes.findIndex(i => i === 'requires_my_approval')
      if(matchIndexRequestMyApprove != -1) {
        codes.splice(matchIndexRequestMyApprove, 1);
        if(codes.length > 0) {
          queryB = await queryB.andWhere('ks2_status.code IN (:...code)', {code: codes})
        }
        queryB = await queryB.andWhere('ks2_users.email = :email', {email: author.Email})
        queryB = await queryB.andWhere('ks2_users.sign_at is null')
        queryB = await queryB.andWhere('ks2_groups.action = :action', {action: true})
        queryB = await queryB.andWhere('ks2_groups.complete = :complete', {complete: false})
      } else {
        queryB = await queryB.andWhere('ks2_status.code IN (:...code)', {code: codes})
      }
    }

    if(searchIndex) {
      queryB = await queryB.andWhere(`${searchIndex} like :query`, { query:`%${search}%` })
    }

    if(sortIndex) {
      // if(sortIndex === 'create_at') sortIndex = 'ks2.'+sortIndex
      queryB = await queryB.orderBy(sortIndex, sort)
    }
    const dataAll = await queryB
      // .skip(limit * (page - 1))
      // .limit(limit)
      .getMany()
    const data = dataAll.slice((limit * (page - 1)), (limit * page))
    const total = await queryB.getCount();

    for(let i = 0; i < data.length; i++) {
      data[i].ks2_approv = []
      const ks2_approv = data[i].ks2_workflow.find(wf => wf.code === 'ks2_approv')
      // Получаем все согласующие группы
      if(ks2_approv) {
        for(let t = 0; t < ks2_approv.ks2_types.length; t++) {
          let ks2_groups = ks2_approv.ks2_types[t].ks2_groups
          for(let g = 0; g < ks2_groups.length; g++) {
            data[i].ks2_approv.push(ks2_groups[g])
            // Если участник группы подписал, то оставляем только его
            const userSign = ks2_groups[g].ks2_users.find(uc => uc.signed === true)
            if(userSign) data[i].ks2_approv[data[i].ks2_approv.length - 1].ks2_users = [userSign]
            // Проверяем на замечания
            const remark = await this.ks2HistoryRepository.find({
              relations: ['author'],
              where: {
                ks2_group_id: ks2_groups[g].id,
                complete: false
              }
            })
            if(remark) data[i].ks2_approv[data[i].ks2_approv.length - 1].remark = remark
          }
        }
      }
      data[i].ks2_sign = []
      const ks2_sign = data[i].ks2_workflow.find(wf => wf.code === 'ks2_sign')
      // Получаем все подписывающие группы
      if(ks2_sign) {
        for(let t = 0; t < ks2_sign.ks2_types.length; t++) {
          let ks2_groups = ks2_sign.ks2_types[t].ks2_groups
          for(let g = 0; g < ks2_groups.length; g++) {
            data[i].ks2_sign.push(ks2_groups[g])
            // Если участник группы подписал, то оставляем только его
            const userSign = ks2_groups[g].ks2_users.find(uc => uc.signed === true)
            if(userSign) data[i].ks2_sign[data[i].ks2_sign.length - 1].ks2_users = [userSign]
            // Проверяем на замечания
            const remark = await this.ks2HistoryRepository.find({
              relations: ['author'],
              where: {
                ks2_group_id: ks2_groups[g].id,
                complete: false
              }
            })
            if(remark) data[i].ks2_sign[data[i].ks2_sign.length - 1].remark = remark
          }
        }
      }
    }

    return {
      success: true,
      data: filter ? data : [],
      total: total
    }
  }

  // Конкретный КС-2
  async getKS2ById(id, user) {
    const data = await this.ks2Repository.findOne(id, {
      relations: [
        'ks2_workflow', 'ks2_workflow.ks2_types', 'ks2_workflow.ks2_types.ks2_groups', 'ks2_workflow.ks2_types.ks2_groups.ks2_users',
        'ks2_file_archive', 'ks2_file_archive.file_type', 'ks2_file_archive.user',
        'ks2_file_excel', 'ks2_file_excel.user',
        'ks2_file_pdf', 'ks2_file_pdf.user',
        'ks6a_file_pdf', 'ks6a_file_pdf.user',
        'ks2_total_sum', 'ks2_total_sum_incl',
        'ks2_status',
        'ks2_history', 'ks2_history.author', 'ks2_history.answer',
        'ks2_comment', 'ks2_comment.author_comment'
      ]
    })
    for(let i of data.ks2_history) {
      const goroup = await this.ks2WorkflowTypeGroupRepository.findOne(i.ks2_group_id)
      i['group'] = goroup
    }
    const ks2_wfs = []
    for(let wf of data.ks2_workflow) {
      ks2_wfs.push(wf.id)
    }
    // Получаем только уникальные группы (из согласования и подисания)
    let uniqeGroup = [],
        users = {},
        commentsCount = 0
    for(let wf of data.ks2_workflow) {
      for(let t of wf.ks2_types) {
        for(let g of t.ks2_groups) {
          // Собираем уникальные группы и всех уникальных пользователей входящих в них
          if(!users[g.code]) users[g.code] = []
          for(let u of g.ks2_users) {
            const matchUser = users[g.code].find(ug => ug.email === u.email)
            if(!matchUser) users[g.code].push({
              email: u.email,
              full_name: u.full_name,
              login: u.login,
              department: u.department,
              position: u.position
            })
          }
          // Здесь только группы и комментарии
          const matchGroup = uniqeGroup.find(ug => ug.code === g.code)
          if(!matchGroup) {
            const commentsByCode = await this.ks2CommentsRepository.find({
              relations: ['author_comment'],
              where: {
                ks2_group_code: g.code,
                ks2_workflow_id: In(ks2_wfs)
              }
            })
            uniqeGroup.push({
              code: g.code,
              name_ru: g.name_ru,
              name_en: g.name_en,
              comments: commentsByCode
            })
            commentsCount += commentsByCode.length
          }
        }
      }
    }
    // Закидываем собранных пользователей в группы
    for(let code in users) {
      const matchGroup = uniqeGroup.findIndex(ug => ug.code === code)
      if(matchGroup != -1) {
        uniqeGroup[matchGroup].users = users[code]
      }
    }
    // console.log(users)
    // const uniqeGroup = await this.ks2WorkflowTypeGroupRepository
    //   .query(`
    //     SELECT DISTINCT code, name_ru, name_en
    //     FROM ks2_workflow_type_group
    //     WHERE ks2_workflow_id in (${ks2_wfs.join(', ')})
    //   `)
    // Ожидает согласования от пользователя
    const waitAgree = await this.getKS2WFInfo({
      ks2_id: id,
      type_action: true,
      type_complete: false,
      type_ks2_workflow_id: data.id,
      groups_action: true,
      groups_complete: false,
      signed: false,
      code: 'ks2_approv'
    })
    // Уже согласовал
    const agree = await this.getKS2WFInfo({
      type_ks2_workflow_id: data.id,
      groups_action: false,
      groups_complete: true,
      signed: true,
      code: 'ks2_approv'
    })
    // Будущие согласанты (ждут очереди)
    const futureAgree = await this.getKS2WFInfo({
      type_action: false,
      type_complete: false,
      type_ks2_workflow_id: data.id,
      groups_action: false,
      groups_complete: false,
      signed: false,
      code: 'ks2_approv'
    })
    // Ожидает согласования от текущего пользователя
    const waitMyAgree = await this.getKS2WFInfo({
      type_action: true,
      type_complete: false,
      type_ks2_workflow_id: data.id,
      groups_action: true,
      groups_complete: false,
      signed: false,
      email: user.Email,
      code: 'ks2_approv'
    })
    // Ожидает подписания от пользователя
    const waitSign = await this.getKS2WFInfo({
      ks2_id: id,
      type_action: true,
      type_complete: false,
      type_ks2_workflow_id: data.id,
      groups_action: true,
      groups_complete: false,
      signed: false,
      code: 'ks2_sign'
    })
    // Уже подписал
    const sign = await this.getKS2WFInfo({
      type_ks2_workflow_id: data.id,
      groups_action: false,
      groups_complete: true,
      signed: true,
      code: 'ks2_sign'
    })
    // Будущие подписанты (ждут очереди)
    const futureSign = await this.getKS2WFInfo({
      type_action: false,
      type_complete: false,
      type_ks2_workflow_id: data.id,
      groups_action: false,
      groups_complete: false,
      signed: false,
      code: 'ks2_sign'
    })
    // Ожидает подписания от текущего пользователя
    const waitMySign = await this.getKS2WFInfo({
      type_action: true,
      type_complete: false,
      type_ks2_workflow_id: data.id,
      groups_action: true,
      groups_complete: false,
      signed: false,
      email: user.Email,
      code: 'ks2_sign'
    })
    return {
      success: true,
      data: data,
      waitAgree: waitAgree,
      agree: agree,
      futureAgree: futureAgree,
      waitMyAgree: waitMyAgree,
      waitSign: waitSign,
      sign: sign,
      futureSign: futureSign,
      waitMySign: waitMySign,
      uniqeGroup: uniqeGroup,
      allCommentsCount: commentsCount
    }
  }

  async getKS2WFInfo(params) {
    const type_action = params.type_action,
          type_complete = params.type_complete,
          type_ks2_workflow_id = params.type_ks2_workflow_id,
          groups_action = params.groups_action,
          groups_complete = params.groups_complete,
          signed = params.signed,
          email = params.email,
          ks2_id = params.ks2_id,
          code = params.code
    // Берем ближайший не начатый WF (согласование или подписание)
    const ks2_current_wf = await this.ks2WorkflowRepository.findOne({
      where: {
        ks2_id: type_ks2_workflow_id,
        code: code
      }
    })
      let queryB
      queryB = await this.ks2WorkflowTypeRepository
        .createQueryBuilder('type')
        .leftJoinAndSelect('type.ks2_groups', 'groups')
        .leftJoinAndSelect('groups.ks2_users', 'users')
        .where('type.ks2_workflow_id = :type_ks2_workflow_id', { type_ks2_workflow_id: ks2_current_wf.id })
      if(type_action && type_complete) {
        queryB = await queryB.andWhere('type.action = :type_action', { type_action: type_action })
          .andWhere('type.complete = :type_complete', { type_complete: type_complete })
      }
      queryB = await queryB
        .andWhere('groups.action = :action', { action: groups_action })
        .andWhere('groups.complete = :complete', { complete: groups_complete })
        .andWhere('users.signed = :signed', { signed: signed })
      if(email) {
        queryB = await queryB.andWhere('users.email = :email', { email: email })
      }
      const data = await queryB
        .orderBy({
          'users.order_execution_user': 'ASC'
        })
        .getMany()
      // Находим замечания для групп
      if(ks2_id && data.length > 0) {
        const remarkKS2 = await this.ks2HistoryRepository.find({
          relations: ['author'],
          where: {
            ks2_id: ks2_id,
            action: true,
            complete: false
          },
          order: {
            'create_at': 'DESC'
          }
        })
        for(let i of data) {
          for(let g of i.ks2_groups) {
            const matchGroup = remarkKS2.find(r => r.ks2_group_id === g.id)
            if(matchGroup) {
              g.remark = true
              g.remarkLast = matchGroup
            }
          }
        }
      }
      return data
  }

  // Удаление КС-2
  async ks2Delete(params) {
    await this.ks2Repository.delete({
      id: params.ks2_id,
      ks3_id: params.ks3_id
    })
    // Проверяем, если в КС-3 не осталось ни одной КС-2, то ставим статус для КС-3 "Проект"
    const checkLengthKS2: any = await this.ks3Service.getKS3id(params.ks3_id)
    if(checkLengthKS2.data[0].ks2.length === 0) {
      await this.ks3Service.changeStage(params.ks3_id, 'project')
    }

    return {
      success: true
    }
  }

  // Удаление списка КС-2
  async ks2MultiDelete(body) {
    let ks3_id
    for(let i of body.data) {
      ks3_id = i.ks3_id
      await this.ks2Repository.delete({
        id: i.ks2_id,
        ks3_id: i.ks3_id
      })
    }
    // Проверяем, если в КС-3 не осталось ни одной КС-2, то ставим статус для КС-3 "Проект"
    const checkLengthKS2: any = await this.ks3Service.getKS3id(ks3_id)
    if(checkLengthKS2.data[0].ks2.length === 0) {
      await this.ks3Service.changeStage(ks3_id, 'project')
    }

    return {
      success: true
    }
  }

  // Удалить файл из КС-2
  async deleteFile(uuid, author) {
    // Убираем индикатор актуальности в архиве
    await this.ks2FileArchiveRepository.update(
      { uuid: uuid },
      {
        actual: false,
        event_ru: `Удалил: ${author.DB.login}`,
        event_en: `Deleted: ${author.DB.login}`
      }
    )
    const ks6a = await this.ks6aFilePdfRepository.findOne({
      where: {
        uuid: uuid
      }
    })
    const other = await this.ks2FileOtherRepository.findOne({
      where: {
        uuid: uuid
      }
    })
    if(ks6a) {
      await this.ks6aFilePdfRepository.delete({
        uuid: uuid
      })
      return {
        success: true
      }
    }
    else if(other) {
      await this.ks2FileOtherRepository.delete({
        uuid: uuid
      })
      return {
        success: true
      }
    } else {
      return {
        success: false,
        message: 'File not found'
      }
    }
  }

  async getKS2Path(uuid) {
    const file = await this.ks2FileArchiveRepository.findOne({
      where: {
        uuid: uuid
      }
    })
    return file.path
  }

  async getKS2Archive(id, filter) {
    let data
    data = await this.ks2FileArchiveRepository
      .createQueryBuilder('archive')
      .leftJoinAndSelect('archive.user', 'user')
      .leftJoinAndSelect('archive.file_type', 'file_type')
      .where('archive.ks2_id = :id', {id:id})

      if(filter === 'ks2_excel') data = await data.andWhere('archive.file_type_id = :tid', {tid:3})
      if(filter === 'ks2_pdf') data = await data.andWhere('archive.file_type_id = :tid', {tid:4})
      if(filter === 'ks6a') data = await data.andWhere('archive.file_type_id = :tid', {tid:5})
      if(filter === 'other_ks2') data = await data.andWhere('archive.file_type_id = :tid', {tid:6})

      data = await data.getMany()
    return {
      success: true,
      data: data
    }
  }

  // Просмотр прочих файлов (без версий, только актуальных)
  async getOtherFile(ks2_id) {
    const data = await this.ks2FileOtherRepository.find({
      relations: ['user'],
      where: {
        ks2_id: ks2_id
      }
    })
    return {
      success: true,
      data: data
    }
  }

  // Информация по WF акта КС-2
  async getWorkflowInfoByKS2Id(ks2_id) {
    const KS2Info = await this.ks2Repository.findOne(ks2_id, {
      relations: ['ks2_workflow']
    })

    const KS2WF: any = await this.ks2WorkflowRepository
      .createQueryBuilder('wf')
      .leftJoinAndSelect('wf.ks2_types', 'types')
      .leftJoinAndSelect('types.type', 'type_info')
      .leftJoinAndSelect('types.ks2_groups', 'groups')
      .leftJoinAndSelect('groups.side', 'side')
      .leftJoinAndSelect('groups.ks2_users', 'users')
      .where('wf.ks2_id = :ks2_id', { ks2_id: ks2_id })
      .orderBy({
        'wf.id': 'ASC',
        'types.order_execution_type': 'ASC',
        'groups.order_execution_group': 'ASC'
      })
      .getMany()
      // Согласование
      const allGroup = await this.ks2WorkflowTypeGroupRepository.find({
        where: { ks2_workflow_id: KS2WF[0].id }
      })
      const allUser = await this.ks2WorkflowTypeGroupUserRepository.find({
        where: { ks2_workflow_id: KS2WF[0].id }
      })
      // Подписание
      const allGroupSign = await this.ks2WorkflowTypeGroupRepository.find({
        where: { ks2_workflow_id: KS2WF[1].id }
      })
      const allUserSign = await this.ks2WorkflowTypeGroupUserRepository.find({
        where: { ks2_workflow_id: KS2WF[1].id }
      })

      return {
        success: true,
        data: KS2WF,
        ks2info: KS2Info,
        allGroup: allGroup,
        allUser: allUser,
        allGroupSign: allGroupSign,
        allUserSign: allUserSign
      }
  }

  async setSortWorkflowElement(body) {
    // Обновляем иерархию типов
    body.params.types.forEach(async (p_type, p_type_idx) => {
      const type_wf = await this.ks2WorkflowTypeRepository.findOne(p_type.id)
      type_wf.order_execution_type = p_type.order_execution_type
      type_wf.hierarchy = p_type.hierarchy
      await this.ks2WorkflowTypeRepository.save(type_wf)
    })
    // Обновляем иерархию групп
    body.params.groups.forEach(async (p_group, p_group_idx) => {
      const group_wf = await this.ks2WorkflowTypeGroupRepository.findOne(p_group.id)
      group_wf.order_execution_group = p_group.order_execution_group
      group_wf.hierarchy = p_group.hierarchy
      await this.ks2WorkflowTypeGroupRepository.save(group_wf)
    })
    // Обновляем иерархию пользователей
    body.params.users.forEach(async (p_user, p_user_idx) => {
      const user_wf = await this.ks2WorkflowTypeGroupUserRepository.findOne(p_user.id)
      user_wf.order_execution_user = p_user.order_execution_user
      user_wf.hierarchy = p_user.hierarchy
      await this.ks2WorkflowTypeGroupUserRepository.save(user_wf)
    })

    return {
      success: true,
      message: 'Data sorted successfully'
    }
  }

  async editGroupInStage(params) {
    const type_id = params.type_id,
          ks2_id = params.ks2_id,
          ks2_wf_id = +params.ks2_wf_id
    const ks2_info = await this.ks2WorkflowRepository.findOne(ks2_wf_id)
    const groupDefault: any = await this.groupRepository.find({
      relations: [
        'user_group',
        'user_group.user',
        'type',
        'side'
      ]
    })
    // Если добавляем группу в новый тип
    if(!type_id) {
      const check = params.group.find(i => i.check === true)
      // Если выбранна хоть одна группа на добавление
      if(check) {
        // Создаем тип для групп
        const createType = this.ks2WorkflowTypeRepository.create({
          order_execution_type: 99, //TODO
          hierarchy: '99', //TODO
          ks2_workflow_id: ks2_info.id,
          type_id: 1,
          ks3_workflow_id: ks2_info.ks3_workflow_id
        })
        const newType = await this.ks2WorkflowTypeRepository.save(createType)
        for(const pg of params.group) {
          if(pg.check) {
            const getGroupByCode = groupDefault.find(x => x.code === pg.code)
            const addGroup = await this.ks2WorkflowTypeGroupRepository.create({
              code: getGroupByCode.code,
              name_ru: getGroupByCode.name_ru,
              name_en: getGroupByCode.name_en,
              ks2_workflow_id: ks2_info.id,
              order_execution_group: 99,
              hierarchy: '99.99',
              ks2_type_id: newType.id,
              ks3_workflow_id: ks2_info.ks3_workflow_id,
              side_id: getGroupByCode.side.id
            })
            const newGroup = await this.ks2WorkflowTypeGroupRepository.save(addGroup)
            // После добавления группы добавляем в нее пользователей
            getGroupByCode.user_group.forEach((u) => {
              const newGroupUser = this.ks2WorkflowTypeGroupUserRepository.create({
                full_name: u.user.full_name,
                login: u.user.login,
                email: u.user.email,
                department: u.user.department,
                position: u.user.position,
                ks2_workflow_id: ks2_info.id,
                ks2_type_id: newType.id,
                ks2_group_id: newGroup.id,
                order_execution_user: 99, //TODO
                hierarchy: '99.99.99', //TODO
                ks3_workflow_id: ks2_info.ks3_workflow_id
              })
              this.ks2WorkflowTypeGroupUserRepository.save(newGroupUser)
            })
          }
        }
      }
    }
    // Если в стадии уже есть тип и группа в нем
    else {
      const typegrouptype: any = await this.ks2WorkflowTypeRepository
        .findOne(type_id, {
          relations: ['ks2_groups']
        })
      for(const pg of params.group) {
        // Находим каждую группу из списка для получения полной информации
        const match = typegrouptype.ks2_groups.find(x => x.code === pg.code)
        if(match) {
          // если группу исключили из стадии
          if(!pg.check) {
            const delGroup = typegrouptype.ks2_groups.filter((g) => g.id === match.id)
            // Удаляем группу
            const group = await this.ks2WorkflowTypeGroupRepository.find({
              where: {
                id: +delGroup[0].id
              }
            })
            await this.ks2WorkflowTypeGroupRepository.remove(group)
          }
        } else {
          // если группу добавили в стадию
          if(pg.check) {
            const getGroupByCode = groupDefault.find(x => x.code === pg.code)
            // получаем группу в стадии с максимальным порядком выполнения, чтобы добавить новую группу после нее
            const maxGroupInStage = await this.ks2WorkflowTypeGroupRepository.findOne({
              where: {
                ks2_workflow_id: ks2_info.id,
                ks2_type_id: pg.type_id
              },
              order: {
                order_execution_group: 'DESC'
              }
            })
            let newOrderExecutionGroup = 0, newHierarchy = '0.0'
            if(maxGroupInStage) {
              // Высчитываем новый порядок выполнения
              newOrderExecutionGroup = +maxGroupInStage.order_execution_group+1
              // Высчитываем новую иерархию
              const maxHierarchy = maxGroupInStage.hierarchy.split('.')
              const newSubHierarchy = +maxHierarchy[1]+1
              newHierarchy = maxHierarchy[0]+'.'+newSubHierarchy
            }
            // Добавляем
            const addGroup = await this.ks2WorkflowTypeGroupRepository.create({
              code: getGroupByCode.code,
              name_ru: getGroupByCode.name_ru,
              name_en: getGroupByCode.name_en,
              ks2_workflow_id: ks2_info.id,
              order_execution_group: newOrderExecutionGroup,
              hierarchy: newHierarchy,
              ks2_type_id: type_id,
              ks3_workflow_id: ks2_info.ks3_workflow_id,
              side_id: getGroupByCode.side.id
            })
            const newGroup = await this.ks2WorkflowTypeGroupRepository.save(addGroup)
            // После добавления группы добавляем в нее пользователей из таблицы по умолчанию
            getGroupByCode.user_group.forEach((u) => {
              const newGroupUser = this.ks2WorkflowTypeGroupUserRepository.create({
                full_name: u.user.full_name,
                login: u.user.login,
                email: u.user.email,
                department: u.user.department,
                position: u.user.position,
                ks2_workflow_id: ks2_info.id,
                ks2_type_id: type_id,
                ks2_group_id: newGroup.id,
                order_execution_user: 99, //TODO
                hierarchy: '99.99.99', //TODO
                ks3_workflow_id: ks2_info.ks3_workflow_id
              })
              this.ks2WorkflowTypeGroupUserRepository.save(newGroupUser)
            })
          }
        }
      }
      // Проверям в конце, если из типа удалили последнюю группу, то тип надо тоже удалить
      const checkTypeEmpty: any = await this.ks2WorkflowTypeRepository
        .findOne(params.type_id, {
          relations: ['ks2_groups']
        })
      if(checkTypeEmpty.ks2_groups.length === 0) {
        await this.ks2WorkflowTypeRepository.remove(checkTypeEmpty)
      }
    }
    return {
      success: true
    }
  }

  // Изменить тип групп
  async updateType(params) {
    const type_id = params.type_id
    const type = await this.ks2WorkflowTypeRepository.findOne(type_id)
    type.type_id = +params.subtype_id
    const data = await this.ks2WorkflowTypeRepository.save(type)
      return {
        success: true,
        data: data
      }
  }

  async getUserInGroup(id) {
    const data = await this.ks2WorkflowTypeGroupRepository.findOne(id, {
      relations: ['ks2_users']
    })
    return {
      success: true,
      data: data
    }
  }

  // Добавить пользователя в группу
  async addUserGroup(params) {
    // Проверяем, есть ли уже пользователь в таблице user
    let modelToAdd = {
      user_id: [],
      group_id: []
    }
    for(let user of params.add_users) {
      const checkUser = await this.ks2WorkflowTypeGroupUserRepository.findOne({
        where: {
          email: user.Email,
          ks2_group_id: params.group_id,
          ks2_type_id: params.type_id
        }
      })
      // Если нет, то добавляем
      if(!checkUser) {
        const ks2_info = await this.ks2WorkflowRepository.findOne({
          // relations: ['ks2_types'],
          where: { ks2_id: params.ks2_id }
        })
        const addUser = await this.ks2WorkflowTypeGroupUserRepository.create({
          full_name: user.DisplayName,
          login: user.UserName,
          email: user.Email,
          department: user.Department,
          position: user.Position,
          ks2_workflow_id: ks2_info.id,
          ks2_type_id: params.type_id,
          ks2_group_id: params.group_id,
          order_execution_user: 999, // TODO
          hierarchy: '999.999.999', // TODO
          ks3_workflow_id: ks2_info.ks3_workflow_id
        })
        const newUser = await this.ks2WorkflowTypeGroupUserRepository.save(addUser)
        modelToAdd.user_id.push(newUser.id)
      } else { modelToAdd.user_id.push(checkUser.id) }
    }
    return {
      success: true
    }
  }

  async delUserInGroup(params) {
    const userWF = await this.ks2WorkflowTypeGroupUserRepository.findOne(params.user_id)
      await this.ks2WorkflowTypeGroupUserRepository.remove(userWF)
      return {
        success: true
      }
  }

  //- Загрузка прочих файлов к КС-2
  async otherUploadFile(body, author) {
    // Получаем информацию по КС-2
    const ks2_info = await this.ks2WorkflowRepository.findOne({
      where: { ks2_id: body.ks2_id }
    })
    // Подготавливаем путь сохранения
    const uuid = uuidv4(),
          ext = body.file.originalName.match(/[0-9a-z]+$/i)[0],
          fileName = uuid+'.'+ext

    const dir = 'ks3'+'/'+ks2_info.ks3_id+'/'+'ks2'+'/'+body.ks2_id+'/'+'other'
    const path = dir+'/'+fileName
    // Сохраняем файл
    const fileData = {
      uuid: uuid,
      file: body.file.buffer,
      dir: dir,
      path: path,
      name: body.file.originalName,
      ext: ext,
      size: +body.file.size
    }
    const file = await this.uploadFile(fileData)
    // Готовим данные для сохранения в БД Архив
    let dataToSave: any = {
      uuid: uuid,
      name: fileData.name,
      path: file.path,
      size: fileData.size,
      ext: fileData.ext,
      mimetype: body.file.mimetype,
      ks2_id: ks2_info.ks2_id,
      ks3_id: ks2_info.ks3_id,
      ks3_workflow_id: ks2_info.ks3_workflow_id,
      user_id: author.DB.id,
      update_uuid: body.ks2_other_file_uuid,
      version: 1
    }
    // Если грузим новую версию файла
    if(body.ks2_other_file_uuid) {
      // Обновляем версию
      const lastVersion = await this.ks2FileArchiveRepository.findOne({
        where: {
          uuid: body.ks2_other_file_uuid
        }
      })
      dataToSave.version = +lastVersion.version + 1
      // Убираем индикатор актуальности у предыдущего файла
      await this.ks2FileArchiveRepository.update(
        { uuid: body.ks2_other_file_uuid },
        {
          actual: false,
          event_ru: `Обновил версию: ${author.DB.login}`,
          event_en: `Updated version: ${author.DB.login}`
        }
      )
    }
    // Прочие файлы (КС-2)
    dataToSave.file_type_id = 6
    // Записываем в архив
    const createOtherFile = await this.ks2FileArchiveRepository.create(dataToSave)
    const newOtherFile = await this.ks2FileArchiveRepository.save(createOtherFile)
    delete dataToSave.file_type_id
    // Если грузим новый файл, а не обновляем
    if(!body.ks2_other_file_id) {
      // Записываем в форму PDF
      const creatFile = await this.ks2FileOtherRepository.create(dataToSave)
      await this.ks2FileOtherRepository.save(creatFile)
    }
    /// Если грузим новую версию файла
    else {
      await this.ks2FileOtherRepository.update({ uuid: body.ks2_other_file_uuid }, dataToSave)
    }

    return {
      success: true,
      data: newOtherFile
    }
  }

  // Проверка КС-2 перед согласованием
  async checkSendApproval(body) {
    const ks2_id_arr = body.ks2_id
    let presense = {
      status: {
        count: 0,
        message_ru: 'Статус соответствует',
        message_en: 'Status matches'
      },
      excel: {
        count: 0,
        message_ru: 'Excel форма в наличии',
        message_en: 'Excel form available'
      },
      pdf: {
        count: 0,
        message_ru: 'PDF форма в наличии',
        message_en: 'PDF form available'
      },
      wf_route: {
        count: 0,
        message_ru: 'Участники согласования в наличии',
        message_en: 'Participants of the agreement are available'
      }
    }
    let error = {
      status: {
        count: 0,
        message_ru: 'Статус не соответствует',
        message_en: 'Status does not match'
      },
      excel: {
        count: 0,
        message_ru: 'Отстутствует Excel форма',
        message_en: 'Missing Excel form'
      },
      pdf: {
        count: 0,
        message_ru: 'Отстутствует PDF форма',
        message_en: 'Missing PDF form'
      },
      wf_route: {
        count: 0,
        message_ru: 'Отстутствуют участники согласования',
        message_en: 'There are no participants in the agreement'
      }
    }
    let data = {
      success: [],
      error: [],
      ready: {
        count: '0/'+ks2_id_arr.length,
        data: []
      }
    }
    // Проверяем поочереди каждую КС-2
    for(let i of ks2_id_arr) {
      let cntC = 0
      const ks2 = await this.ks2Repository.findOne(i, {
        relations: [
          'ks2_workflow', 'ks2_workflow.ks2_types', 'ks2_workflow.ks2_types.ks2_groups', 'ks2_workflow.ks2_types.ks2_groups.ks2_users',
          'ks2_file_archive', 'ks2_file_archive.file_type', 'ks2_file_archive.user',
          'ks2_file_excel', 'ks2_file_excel.user',
          'ks2_file_pdf', 'ks2_file_pdf.user',
          'ks6a_file_pdf', 'ks6a_file_pdf.user',
          'ks2_total_sum', 'ks2_total_sum_incl',
          'ks2_status'
        ]
      })
      // Проверяем на статус (только "Проект")
      if(ks2.ks2_status.code === 'project') {
        cntC++
        presense.status.count++
        data.success.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: `Статус "${ks2.ks2_status.name_ru}" соответствует`,
          message_en: `The status "${ks2.ks2_status.name_en}" corresponds to`
        })
      } else {
        cntC--
        error.status.count++
        data.error.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: `Статус "${ks2.ks2_status.name_ru}" не соответствует`,
          message_en:`The status "${ks2.ks2_status.name_en}" does not match`
        })
      }
      // Проверяем на наличие Excel
      if(!ks2.ks2_file_excel) {
        cntC--
        error.excel.count++
        data.error.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Отстутствует Excel форма',
          message_en: 'Missing Excel form'
        })
      } else {
        cntC++
        presense.excel.count++
        data.success.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Excel форма в наличии',
          message_en: 'Excel form available'
        })
      }
      // Проверяем на наличие PDF
      if(!ks2.ks2_file_pdf) {
        cntC--
        error.pdf.count++
        data.error.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Отстутствует PDF форма',
          message_en: 'Missing PDF form'
        })
      } else {
        cntC++
        presense.pdf.count++
        data.success.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'PDF форма в наличии',
          message_en: 'PDF form available'
        })
      }
      // Проверяем коррктный ли маршрут согласования
      if(ks2.ks2_workflow[0].ks2_types.length === 0) {
        cntC--
        error.wf_route.count++
        data.error.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Отстутствуют участники согласования',
          message_en: 'There are no participants in the agreement'
        })
      } else {
        cntC++
        presense.wf_route.count++
        data.success.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Участники согласования в наличии',
          message_en: 'Participants of the agreement are available'
        })
      }
      // Смотрим сколько не содержит ошибок и готовых к подписанию
      const cntR = Object.keys(presense).length
      if(cntC === cntR) {
        let cntFullReady = +data.ready.count.split('/')[0]
        cntFullReady++
        data.ready.count = cntFullReady+'/'+ks2_id_arr.length
        data.ready.data.push({
          ks2_id: ks2.id,
          ks2_workflow_id: ks2.ks2_workflow[0].id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation
        })
      }
    }
    return {
      success: true,
      data: data,
      error: error,
      presense: presense
    }
  }

  // Запуск согласования КС-2
  async startWorkflow(body, author) {
    // Список всех КС-2 отправленных на согласование
    const data = body.data
    let send = []
    for(let item of data) {
      const ks2 = await this.ks2Repository.findOne(item.ks2_id, {
        relations: ['ks2_workflow']
      })
      const startWf = ks2.ks2_workflow.find(wf => !wf.started && !wf.complete)
      // Если согласование
      let status
      if(startWf.code === 'ks2_approv') {
        status = await this.ks2StatusRepository.findOne({
          where: { code: 'approval' }
        })
      }
      // Если подписание
      else if(startWf.code === 'ks2_sign') {
        status = await this.ks2StatusRepository.findOne({
          where: { code: 'signing' }
        })
      }
      // Обновляем creator для участников согласования на того кто запустил согласование, чтобы автор запуска смог удалять согласантов
      await this.ks2WorkflowTypeGroupUserRepository.update({ks2_workflow_id: item.ks2_workflow_id}, {creator: author.Email})
      // Добавляем роль negotiator для участников согласования конкретной КС-2
      // Находим всех участников согласования
      const approvers = await this.ks2WorkflowTypeGroupUserRepository.find({
        where: {ks2_workflow_id: item.ks2_workflow_id}
      })
      for(let user of approvers) {
        // Есть ли пользователь в БД
        const checkUser = await this.userService.getUserByEmail(user.email)
        if(!checkUser) await this.userService.create({
          uuid: user.uuid,
          full_name: user.full_name,
          login: user.login,
          email: user.email,
          department: user.department,
          position: user.position
        })
        await this.userService.addUserRole(user.email, 'negotiator_ks2')
      }
      // Меняем статус у акта на "На согласовании" / "На подписании"
      await this.ks2Repository.update(ks2.id, { ks2_status_id: status.id })
      // Меняем индикатор старта у KS2_WF
      // Т.к. у нас есть два типа WF - согласование и подписание, то меняем индикатор у первого не начатого и не завершенного
      const ks2_wf = await this.ks2WorkflowRepository.find({ where: { ks2_id: ks2.id } })
      for(let wf of ks2_wf) {
        if(!wf.started && !wf.complete) {
          await this.ks2WorkflowRepository.update({
            id: wf.id,
            ks2_id: ks2.id
          }, { started: true })
          break
        }
      }
      // Меняем стадию у КС-3 на "Согласование КС-2" / "Подписание КС-2"
      const ks3_id = ks2.ks3_id
      await this.ks3Service.changeStage(ks3_id, startWf.code)
      // Подготовка и рассылка уведомлений согласантам
      // const sendResult = await this.preparationAndSendMultiMailKS2WF(item.ks2_id, author)
      // send.push(sendResult)
      this.logger.log(`User "${author.DB.email}" started the approval process for KS-2 id ${item.ks2_id}`, KS2Service.name)
    }
    // Подготовка и рассылка общего уведомления согласантам
    const sendResult = await this.preparationAndSendMailKS2WF(data, author)
    send.push({
      sendEmail: sendResult.sendEmail,
      sendEmailExtra: sendResult.sendEmailExtra
    })
    // Активируем Actions у типов групп
    await this.activateTypeAndGroup(data)

    return {
      success: true,
      data: send
    }
  }

  // Проверка КС-2 перед подписанием
  async checkSendSign(body) {
    const ks2_id_arr = body.ks2_id
    let presense = {
      status: {
        count: 0,
        message_ru: 'Статус соответствует',
        message_en: 'Status matches'
      },
      excel: {
        count: 0,
        message_ru: 'Excel форма в наличии',
        message_en: 'Excel form available'
      },
      pdf: {
        count: 0,
        message_ru: 'PDF форма в наличии',
        message_en: 'PDF form available'
      },
      wf_route: {
        count: 0,
        message_ru: 'Участники подписания в наличии',
        message_en: 'Signature participants available'
      }
    }
    let error = {
      status: {
        count: 0,
        message_ru: 'Статус не соответствует',
        message_en: 'Status does not match'
      },
      excel: {
        count: 0,
        message_ru: 'Отстутствует Excel форма',
        message_en: 'Missing Excel form'
      },
      pdf: {
        count: 0,
        message_ru: 'Отстутствует PDF форма',
        message_en: 'Missing PDF form'
      },
      wf_route: {
        count: 0,
        message_ru: 'Отсутствуют участники подписания',
        message_en: 'No signatories'
      }
    }
    let data = {
      success: [],
      error: [],
      ready: {
        count: '0/'+ks2_id_arr.length,
        data: []
      }
    }
    // Проверяем поочереди каждую КС-2
    for(let i of ks2_id_arr) {
      let cntC = 0
      const ks2 = await this.ks2Repository
        .createQueryBuilder('ks2')
        .leftJoinAndSelect('ks2.ks2_workflow', 'ks2_workflow')
        .leftJoinAndSelect('ks2_workflow.ks2_types', 'ks2_types')
        .leftJoinAndSelect('ks2_types.ks2_groups', 'ks2_groups')
        .leftJoinAndSelect('ks2_groups.ks2_users', 'ks2_users')
        .leftJoinAndSelect('ks2.ks2_file_archive', 'ks2_file_archive')
        .leftJoinAndSelect('ks2_file_archive.file_type', 'file_type')
        .leftJoinAndSelect('ks2_file_archive.user', 'user')
        .leftJoinAndSelect('ks2.ks2_file_excel', 'ks2_file_excel')
        .leftJoinAndSelect('ks2.ks2_file_pdf', 'ks2_file_pdf')
        .leftJoinAndSelect('ks2.ks6a_file_pdf', 'ks6a_file_pdf')
        .leftJoinAndSelect('ks2.ks2_total_sum', 'ks2_total_sum')
        .leftJoinAndSelect('ks2.ks2_total_sum_incl', 'ks2_total_sum_incl')
        .leftJoinAndSelect('ks2.ks2_status', 'ks2_status')
        .where('ks2.id = :ks2_id', { ks2_id: i })
        .andWhere('ks2_workflow.code = :ks2_code', { ks2_code: 'ks2_sign'})
        .getOne()
      // Проверяем на статус (только "Согласован")
      if(ks2.ks2_status.code === 'agreed') {
        cntC++
        presense.status.count++
        data.success.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: `Статус "${ks2.ks2_status.name_ru}" соответствует`,
          message_en: `The status "${ks2.ks2_status.name_en}" corresponds to`
        })
      } else {
        cntC--
        error.status.count++
        data.error.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: `Статус "${ks2.ks2_status.name_ru}" не соответствует`,
          message_en:`The status "${ks2.ks2_status.name_en}" does not match`
        })
      }
      // Проверяем на наличие Excel
      if(!ks2.ks2_file_excel) {
        cntC--
        error.excel.count++
        data.error.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Отстутствует Excel форма',
          message_en: 'Missing Excel form'
        })
      } else {
        cntC++
        presense.excel.count++
        data.success.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Excel форма в наличии',
          message_en: 'Excel form available'
        })
      }
      // Проверяем на наличие PDF
      if(!ks2.ks2_file_pdf) {
        cntC--
        error.pdf.count++
        data.error.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Отстутствует PDF форма',
          message_en: 'Missing PDF form'
        })
      } else {
        cntC++
        presense.pdf.count++
        data.success.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'PDF форма в наличии',
          message_en: 'PDF form available'
        })
      }
      // Проверяем коррктный ли маршрут согласования
      if(ks2.ks2_workflow[0].ks2_types.length === 0) {
        cntC--
        error.wf_route.count++
        data.error.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Отстутствуют участники согласования',
          message_en: 'There are no participants in the agreement'
        })
      } else {
        cntC++
        presense.wf_route.count++
        data.success.push({
          ks2_id: ks2.id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation,
          message_ru: 'Участники согласования в наличии',
          message_en: 'Participants of the agreement are available'
        })
      }
      // Смотрим сколько не содержит ошибок и готовых к подписанию
      const cntR = Object.keys(presense).length
      if(cntC === cntR) {
        let cntFullReady = +data.ready.count.split('/')[0]
        cntFullReady++
        data.ready.count = cntFullReady+'/'+ks2_id_arr.length
        data.ready.data.push({
          ks2_id: ks2.id,
          ks2_workflow_id: ks2.ks2_workflow[0].id,
          document_number: ks2.document_number,
          date_preparation: ks2.date_preparation
        })
      }
    }
    return {
      success: true,
      data: data,
      error: error,
      presense: presense
    }
  }

  // Подготовка и рассылка одного общего уведомления на множество актов КС-2
  async preparationAndSendMailKS2WF(data, author) {
    let emailList = [], ks3id = null, ks3wfid = null, ks2wfid, ks2typeid, ks2groupid = []
    let emailListExtra = [], ks2groupidExtra = []
    for(let item of data) {
      // Находим WF для конкретной КС-2
      const ks2wf = await this.ks2WorkflowRepository
        .createQueryBuilder('ks2wf')
        .leftJoinAndSelect('ks2wf.ks2_types', 'ks2_types')
        .leftJoinAndSelect('ks2_types.ks2_groups', 'ks2_groups')
        .leftJoinAndSelect('ks2_groups.ks2_users', 'ks2_users')
        .where('ks2_id = :ks2_id', {ks2_id: item.ks2_id})
        .getRawMany()
      ks2wfid = ks2wf[0].ks2wf_id
      ks3id = ks2wf[0].ks2wf_ks3_id
      ks3wfid = ks2wf[0].ks2wf_ks3_workflow_id
      // Находим наименьший тип который еще не стартанул (за исключением типа "Экстра")
      const startTypeIndex = ks2wf.find(i =>
        !i.ks2_types_action
        && !i.ks2_types_complete
        && i.ks2_types_type_id != 3)
      ks2typeid = startTypeIndex.ks2_types_id
      /**
       * т.к. делаем getRawMany, то в результате будет столько строк
       * сколько пользователей в первом типе
       */
      for(let i of ks2wf) {
        // Находим Экстра согласующих
        if(i.ks2_types_type_id === 3) {
          emailListExtra.push(i.ks2_users_email)
          ks2groupidExtra.push(i.ks2_groups_id)
        }
        // Находим параллельные группы, которые должны стартануть вместе
        if(i.ks2_groups_order_execution_group === startTypeIndex.ks2_groups_order_execution_group) {
          emailList.push(i.ks2_users_email)
          ks2groupid.push(i.ks2_groups_id)
        }
      }
    }
    // Оставляем только уникальные email
    emailList = [...new Set(emailList)]
    emailListExtra = [...new Set(emailListExtra)]
    // Параметры
    const textBody = await this.mailingService.getGeneralTemplate(ks3id)
    const theme = `Согласование актов КС-2 АЭС "Аккую" | Approval of the KS-2 certificates "Akkuyu" NPP`
    const text = {
      text_ru: `Вас назначили согласантом актов КС-2`,
      text_en: `You have been appointed as a coordinator of the KS-2 certificate`
    }
    let emailListPrepare = []
    for(let i of emailList) {
      // Добавляем внутреннее уведомление
      await this.notificationService.create(i, text)
      emailListPrepare.push({Email: i})
    }
    // Для экстра согласующих
    let emailListExtraPrepare = []
    for(let e of emailListExtra) {
      await this.notificationService.create(e, text)
      emailListExtraPrepare.push({Email: e})
    }

    const sendData = {
      ListEmails: emailListPrepare,
      Subject: theme,
      MessageText: textBody,
      ks2_id: null,
      ks3_id: ks3id,
      ks2_workflow_id: null,
      ks3_workflow_id: ks3wfid,
      author_email: author.DB.email
    }
    // Для экстра согласующих
    const sendDataExtra = {
      ListEmails: emailListExtraPrepare,
      Subject: theme,
      MessageText: textBody,
      ks2_id: null,
      ks3_id: ks3id,
      ks2_workflow_id: null,
      ks3_workflow_id: ks3wfid,
      author_email: author.DB.email
    }
    // Осуществляем рассылку по собранной модели
    // Для экстра
    const sendEmailExtra = await this.mailingService.sendMail(sendDataExtra)
    // Для остальных
    const sendEmail = await this.mailingService.sendMail(sendData)
    // Проставляем индикатор что письмо конкретному пользователю ушло
    // Для экстра
    if(sendEmailExtra.code) {
      for(let e of emailListExtra) {
        await this.ks2WorkflowTypeGroupUserRepository
          .createQueryBuilder('ks2_users')
          .update()
          .set({ mail_code: sendEmailExtra.code })
          .where('email = :email', { email: e })
          .andWhere('ks2_workflow_id = :ks2_workflow_id', { ks2_workflow_id: ks2wfid })
          .andWhere('ks2_type_id = :ks2_type_id', { ks2_type_id: ks2typeid })
          .andWhere('ks2_group_id IN (:...groups)', {groups: ks2groupid})
          .execute()
      }
    }
    // Для остальных
    if(sendEmail.code) {
      for(let e of emailList) {
        await this.ks2WorkflowTypeGroupUserRepository
          .createQueryBuilder('ks2_users')
          .update()
          .set({ mail_code: sendEmail.code })
          .where('email = :email', { email: e })
          .andWhere('ks2_workflow_id = :ks2_workflow_id', { ks2_workflow_id: ks2wfid })
          .andWhere('ks2_type_id = :ks2_type_id', { ks2_type_id: ks2typeid })
          .andWhere('ks2_group_id IN (:...groups)', {groups: ks2groupid})
          .execute()
      }
    }

    return {
      sendEmail: sendEmail.data,
      sendEmailExtra: sendEmailExtra.data
    }
  }

  // Подготовка и рассылка уведомлений согласантам на каждый конкретный акт КС-2
  async preparationAndSendMultiMailKS2WF(ks2_id, author) {
    // const ks2 = await this.ks2Repository.findOne(ks2_id)
    // // Находим WF для конкретной КС-2
    // const ks2wf = await this.ks2WorkflowRepository
    //   .createQueryBuilder('ks2wf')
    //   .leftJoinAndSelect('ks2wf.ks2_types', 'ks2_types')
    //   .leftJoinAndSelect('ks2_types.ks2_groups', 'ks2_groups')
    //   .leftJoinAndSelect('ks2_groups.ks2_users', 'ks2_users')
    //   .where('ks2_id = :ks2_id', {ks2_id: ks2_id})
    //   .getRawMany()
    // // Находим наименьший тип который еще не стартанул
    // const startTypeIndex = ks2wf.find(i => !i.ks2_types_action && !i.ks2_types_complete)
    // let data = [], tmpGroupCode = null, emailList = []
    // /**
    //  * т.к. делаем getRawMany, то в результате будет столько строк
    //  * сколько пользователей в первом типе
    //  */
    // for(let i of ks2wf) {
    //   // Находим параллельные (если они есть) типы, которые должны стартануть вместе
    //   if(i.ks2_types_order_execution_type === startTypeIndex.ks2_types_order_execution_type) {
    //     // Находим параллельные группы, которые должны стартануть вместе
    //     if(i.ks2_groups_order_execution_group === startTypeIndex.ks2_groups_order_execution_group) {
    //       emailList.push({ Email: i.ks2_users_email })

    //       // Добавляем внутреннее уведомление
    //       const text = {
    //         text_ru: `Вас назначили согласантом акта КС-2 № ${ks2.document_number}`,
    //         text_en: `You have been appointed to approve the KS-2 certificate № ${ks2.document_number}`
    //       }
    //       await this.notificationService.create(i.ks2_users_email, text)

    //       if(i.ks2_groups_code != tmpGroupCode) {
    //         const date_preparation_ru = moment(ks2.date_preparation).format('DD.MM.yyyy');
    //         const subcontract_date_ru = moment(ks2.subcontract_date).format('DD.MM.yyyy');
    //         const date_preparation_en = moment(ks2.date_preparation).format('MM/DD/yyyy');
    //         const subcontract_date_en = moment(ks2.subcontract_date).format('MM/DD/yyyy');
    //         const textBody = await this.mailingService.getKS2Template({
    //           ks2_id: ks2_id,
    //           document_number: ks2.document_number,
    //           estimate_number: ks2.estimate_number,
    //           subcontract_number: ks2.subcontract_number,
    //           ks2_groups_name_ru: i.ks2_groups_name_ru,
    //           ks2_groups_name_en: i.ks2_groups_name_en,
    //           date_preparation_ru: date_preparation_ru,
    //           subcontract_date_ru: subcontract_date_ru,
    //           date_preparation_en: date_preparation_en,
    //           subcontract_date_en: subcontract_date_en
    //         })

    //         const theme = `Согласование акта КС-2 №${ks2.document_number} от ${date_preparation_ru} | Approval of the KS-2 certificate №${ks2.document_number} of ${date_preparation_en}`

    //         data.push({
    //           ListEmails: emailList,
    //           Subject: theme,
    //           MessageText: textBody,
    //           // Link: `http://localhost:3000/#/ks2/${ks2_id}`,
    //           ks2_id: i.ks2wf_ks2_id,
    //           ks3_id: i.ks2wf_ks3_id,
    //           ks2_workflow_id: i.ks2wf_id,
    //           ks3_workflow_id: i.ks2wf_ks3_workflow_id,
    //           author_email: author.DB.email
    //         })
    //       } else { emailList = [] }
    //       tmpGroupCode = i.ks2_groups_code
    //     }
    //   }
    // }
    // let result = []
    // // Осуществляем рассылку по собранной модели
    // for(let i of data) {
    //   /**
    //    * @param {ListEmails: array} [{ Email: a@a.ru }] адресаты
    //    * @param {Subject: string} тема письма
    //    * @param {MessageText: string} тело письма (поддерживает формат html)
    //    */
    //   const sendEmail = await this.mailingService.sendMail(i)
    //   result.push(sendEmail.data)
    // }

    // return result
  }

  // Активируем типы у групп
  async activateTypeAndGroup(data) {
    for(let item of data) {
      const ks2wf = await this.ks2WorkflowRepository
        .createQueryBuilder('ks2wf')
        .leftJoinAndSelect('ks2wf.ks2_types', 'ks2_types')
        .leftJoinAndSelect('ks2_types.ks2_groups', 'ks2_groups')
        .leftJoinAndSelect('ks2_groups.ks2_users', 'ks2_users')
        .where('ks2_id = :ks2_id', {ks2_id: item.ks2_id})
        .getRawMany()
      // Находим наименьший тип который еще не стартанул (за исключением типа "Экстра")
      const startTypeIndex = ks2wf.find(i =>
        !i.ks2_types_action
        && !i.ks2_types_complete
        && i.ks2_types_type_id != 3)
      // Находим все Экстра типы
      for(let i of ks2wf) {
        if(i.ks2_types_type_id === 3 && !i.ks2_types_complete) {
          // Активируем типы
          await this.ks2WorkflowTypeRepository.update({ id: i.ks2_types_id },{ action: true })
          // Активируем группы
        await this.ks2WorkflowTypeGroupRepository.update({
          ks2_type_id: i.ks2_types_id
        },{ action: true })
        }
      }
      // Для остальных
      const needStartTypes = await this.ks2WorkflowTypeRepository
        .find({
          where: {
            ks2_workflow_id: item.ks2_workflow_id,
            order_execution_type: startTypeIndex.ks2_types_order_execution_type
          }
        })
      // Активируем
      for(let type of needStartTypes) {
        await this.ks2WorkflowTypeRepository.update({ id: type.id },{ action: true })
        // Находим первую по порядку группу
        const startGroupIndex = ks2wf.find(i =>
          !i.ks2_groups_action
          && !i.ks2_groups_complete
          && i.ks2_types_type_id != 3
        )
        await this.ks2WorkflowTypeGroupRepository.update({
          ks2_type_id: type.id,
          order_execution_group: startGroupIndex.ks2_groups_order_execution_group
        },{ action: true })
      }
    }
  }

  // Предварительная проверка перед подписанием КС-2
  async checkApprove(body, author) {
    const ks2_id_arr = body.params
    let ks2_ready = [], message = []
    let user = [], group = []
    for(let i of ks2_id_arr) {
      if(i.checked) {
        const ks2 = await this.ks2Repository.findOne(i.id, {
          relations: [
            'ks2_workflow', 'ks2_workflow.ks2_types', 'ks2_workflow.ks2_types.ks2_groups', 'ks2_workflow.ks2_types.ks2_groups.ks2_users',
            'ks2_status',
            'ks2_file_pdf',
            'ks2_history'
          ]
        })
        // Проверяем на статус
        if(ks2.ks2_status.code === 'approval' || ks2.ks2_status.code === 'signing' || ks2.ks2_status.code === 'fixing') {
          // Берем ближайший запущенный WF (согласование или подписание)
          const ks2_wf = await this.ks2WorkflowRepository.findOne({
            relations: [
              'ks2_types', 'ks2_types.ks2_groups', 'ks2_types.ks2_groups.ks2_users'
            ],
            where: {
              ks2_id: i.id,
              started: true,
              complete: false
            }
          })
          // Находим наименьший тип который еще не завершен (за исключением типа "Экстра")
          const startTypeIndex = ks2_wf.ks2_types.find(i =>
            i.action
            && !i.complete
            && i.type_id != 3
          )
          // Собираем Экстра согласующих
          let startTypeExtra = []
          for(let e of ks2_wf.ks2_types) {
            if(e.action && !e.complete && e.type_id === 3) startTypeExtra.push(e)
          }
          let matchMyExtra = null
          if(startTypeExtra.length > 0) {
            for(let e of startTypeExtra) {
              for(let g of e.ks2_groups) {
                if(g.action && !g.complete) {
                  const startUser = g.ks2_users.find(i => i.email === author.Email)
                  if(startUser) {
                    const remark = ks2.ks2_history.find(h =>
                      h.ks2_group_id === g.id
                      && h.action
                      && !h.complete
                    )
                    if(!remark) {
                      matchMyExtra = startUser
                      user.push(startUser)
                      group.push(g)
                      ks2_ready.push({
                        ks2: ks2,
                        group: g,
                        user: startUser,
                        ks2_pdf: ks2.ks2_file_pdf
                      })
                      break
                    }
                  }
                } else {
                  message.push({
                    text_ru: 'Нет ожиданий согласования от Вас',
                    text_en: 'No expectation of approval from you',
                    ks2: ks2
                  })
                }
              }
            }
          }
          if(startTypeIndex) {
            for(let g of startTypeIndex.ks2_groups) {
              if(g.action && !g.complete) {
                const startUser = g.ks2_users.find(i => i.email === author.Email)
                if(startUser) {
                  const remark = ks2.ks2_history.find(h =>
                    h.ks2_group_id === g.id
                    && h.action
                    && !h.complete
                  )
                  if(!remark) {
                    if(!matchMyExtra) {
                      user.push(startUser)
                      group.push(g)
                      ks2_ready.push({
                        ks2: ks2,
                        group: g,
                        user: startUser,
                        ks2_pdf: ks2.ks2_file_pdf
                      })
                      break
                    }
                  } else {
                    message.push({
                      text_ru: 'Необходимо дождаться устранения замечаний',
                      text_en: 'It is necessary to wait until the remarks are corrected',
                      ks2: ks2
                    })
                  }
                }
              } else {
                message.push({
                  text_ru: 'Нет ожиданий согласования от Вас',
                  text_en: 'No expectation of approval from you',
                  ks2: ks2
                })
              }
            }
          }
        } else {
          message.push({
            text_ru: 'Не соответствует статус',
            text_en: 'Doesnt match the status',
            ks2: ks2
          })
        }
      }
    }
    return {
      success: group.length > 0,
      ks2_ready: ks2_ready,
      count_ready: ks2_ready.length+'/'+ks2_id_arr.length,
      message: message,
      user: user,
      group: group
    }
  }

  // Согласование/Подписание КС-2
  async approve(body, author) {
    const ks2_id_arr = body.params
    let emailList = [], ks2wfid, ks3id, ks3wfid, ks2typeid, ks2groupid = []
    for(let i of ks2_id_arr) {
      const kswf_id = await (await this.ks2WorkflowTypeGroupUserRepository.findOne(i.user.id)).ks2_workflow_id
      // Подписываем пользователем и сразу закрываем группу
      await this.ks2WorkflowTypeGroupUserRepository.update(i.user.id, {
        signed: true,
        sign_at: moment(new Date()).add(3, 'hours').toDate()
      })
      // Делаем параллельных пользователей в группе неактивными
      await this.ks2WorkflowTypeGroupUserRepository.update(
        {
          ks2_group_id: i.group.id,
          signed: false
        },
        {
          active: false
        }
      )
      // Закрываем группу
      await this.ks2WorkflowTypeGroupRepository.update(i.group.id, {
        action: false,
        complete: true
      })
      // Проверяем, есть ли в типе еще не закрытые группы
      const ks2_type = await this.ks2WorkflowTypeRepository.findOne(i.user.ks2_type_id, {
        relations: ['type', 'ks2_groups']
      })
      let noCompleteGroupInType = ks2_type.ks2_groups.find(g => !g.complete)
      // Если нет хоть одной незавершенной группы, то закрываем типи
      if(!noCompleteGroupInType) {
        await this.ks2WorkflowTypeRepository.update(i.user.ks2_type_id, {
          action: false,
          complete: true
        })
      }
      // Проверяем, есть ли следующий по очерди согласующий
      const ks2wf = await this.ks2WorkflowRepository
        .createQueryBuilder('ks2wf')
        .leftJoinAndSelect('ks2wf.ks2_types', 'ks2_types')
        .leftJoinAndSelect('ks2_types.ks2_groups', 'ks2_groups')
        .leftJoinAndSelect('ks2_groups.ks2_users', 'ks2_users')
        .where('ks2wf.id = :kswf_id', { kswf_id: kswf_id })
        .andWhere('ks2_id = :ks2_id', { ks2_id: i.ks2.id })
        .andWhere('ks2wf.started = 1')
        .andWhere('ks2wf.complete = 0')
        .getRawMany()
      ks2wfid = ks2wf[0].ks2wf_id
      ks3id = ks2wf[0].ks2wf_ks3_id
      ks3wfid = ks2wf[0].ks2wf_ks3_workflow_id
      const startTypeIndex = ks2wf.find(i =>
        !i.ks2_types_complete
        && i.ks2_types_type_id != 3
        // && !i.ks2_groups_action
        && !i.ks2_users_signed
      )
      // Находим Экстра согласующих
      const startExtraTypeIndex = []
      for(let i of ks2wf) {
        if(!i.ks2_types_complete && !i.ks2_users_signed && i.ks2_types_type_id === 3) startExtraTypeIndex.push(i)
      }
      // Если есть последующие согласанты
      if(startTypeIndex) {
        // Находим все группы со следующим порядком выполнения
        const ks2group = await this.ks2WorkflowTypeGroupRepository.find({
          relations: ['ks2_users'],
          where: {
            ks2_workflow_id: ks2wfid,
            ks2_type_id: startTypeIndex.ks2_types_id,
            // id: startTypeIndex.ks2_groups_id,
            complete: false,
            order_execution_group: startTypeIndex.ks2_groups_order_execution_group
          }
        })
        // Запускаем согласование по следующим группам
        for(let g of ks2group) {
          ks2groupid.push(g.id)
          // Активируем тип
          await this.ks2WorkflowTypeRepository.update({ id: g.ks2_type_id },{ action: true })
          // Активируем группу
          await this.ks2WorkflowTypeGroupRepository.update(g.id, { action: true })
          // Собираем следующих участников согласования
          const nextUsers = await this.ks2WorkflowTypeGroupUserRepository.find({
            where: {
              ks2_group_id: g.id,
              mail_code: IsNull()
            }
          })
          for(let u of nextUsers) { emailList.push(u.email) }
        }
      }
      // Если согласовал последний участник и нет Экстра участников
      else if(startExtraTypeIndex.length === 0) {
        // Находим выполняющийся wf
        const ks2wf = await this.ks2WorkflowRepository.find({
          where: {
            ks2_id: i.ks2.id
          }
        })
        const currentWf = ks2wf.find(wf => !wf.complete)
        // Меняем статус у акта на "Согласован" (agreed) или "Подписан" (signed)
        let statusCode
        if(currentWf.code === 'ks2_approv') {
          statusCode = 'agreed'
        } else {
          statusCode = 'signed'
        }
        const status = await this.ks2StatusRepository.findOne({
          where: { code: statusCode }
        })
        await this.ks2Repository.update(i.ks2.id, { ks2_status_id: status.id })
        // Закрываем WF
        await this.ks2WorkflowRepository.update(ks2wfid, {
          started: false,
          complete: true
        })
      }
    }
    if(emailList.length > 0) {
      // Оставляем только уникальные email
      emailList = [...new Set(emailList)]
      // Параметры
      const textBody = await this.mailingService.getGeneralTemplate(ks3id)
      const theme = `Согласование актов КС-2 АЭС "Аккую" | Approval of the KS-2 certificates "Akkuyu" NPP`
      let emailListPrepare = []
      for(let i of emailList) {
        // Добавляем внутреннее уведомление
        const text = {
          text_ru: `Вас назначили согласантом актов КС-2`,
          text_en: `You have been appointed as a coordinator of the KS-2 certificate`
        }
        await this.notificationService.create(i, text)
        emailListPrepare.push({Email: i})
      }
  
      const sendData = {
        ListEmails: emailListPrepare,
        Subject: theme,
        MessageText: textBody,
        ks2_id: null,
        ks3_id: ks3id,
        ks2_workflow_id: null,
        ks3_workflow_id: ks3wfid,
        author_email: author.DB.email
      }
      // Осуществляем рассылку по собранной модели
      const sendEmail = await this.mailingService.sendMail(sendData)
      // Проставляем индикатор что письмо конкретному пользователю ушло
      if(sendEmail.code && ks2typeid) {
        for(let e of emailList) {
          await this.ks2WorkflowTypeGroupUserRepository
            .createQueryBuilder('ks2_users')
            .update()
            .set({ mail_code: sendEmail.code })
            .where('email = :email', { email: e })
            .andWhere('ks2_workflow_id = :ks2_workflow_id', { ks2_workflow_id: ks2wfid })
            .andWhere('ks2_type_id = :ks2_type_id', { ks2_type_id: ks2typeid })
            .andWhere('ks2_group_id IN (:...groups)', {groups: ks2groupid})
            .execute()
        }
      }

      return {
        success: true,
        data: sendEmail.data
      }
    }
    return {
      success: true,
      data: []
    }
  }

  // Добавление экстра согласующего в акт КС-2
  async addextraapprover(body, author) {
    const ks2_id = body.ks2_id,
          data = body.data
    // Находим выполняющийся wf
    const ks2wf = await this.ks2WorkflowRepository.find({
      where: {
        ks2_id: ks2_id
      }
    })
    const currentWf = ks2wf.find(wf => !wf.complete)
    const ks2_wf_id = currentWf.id
    // Найти id типа Экстра
    const extraType = await this.groupTypeRepository.findOne({
      where: { name_en: 'Extra' }
    })
    const type_id = extraType.id
    const ks2_info = await this.ks2WorkflowRepository.findOne({
      where: {
        id: ks2_wf_id,
        ks2_id: ks2_id
      }
    })
    const ks3id = ks2_info.ks3_id
    const ks3wfid = ks2_info.ks3_workflow_id
    // Создаем тип Экстра
    const createType = await this.ks2WorkflowTypeRepository.create({
      order_execution_type: 0,
      hierarchy: '0',
      action: true,
      complete: false,
      ks2_workflow_id: ks2_wf_id,
      type_id: type_id,
      ks3_workflow_id: ks2_info.ks3_workflow_id
    })
    const newType = await this.ks2WorkflowTypeRepository.save(createType)
    let emailList = []
    for(let i of data) {
      // Получаем информацию по группе
      const groupInfo = await this.groupRepository.findOne({
        where: { code: i.group_code }
      })
      // Создаем группы
      const createGroup = await this.ks2WorkflowTypeGroupRepository.create({
        code: i.group_code,
        name_ru: groupInfo.name_ru,
        name_en: groupInfo.name_en,
        action: true,
        complete: false,
        deadline: moment(new Date()).add(1, 'M').toDate(),
        ks2_workflow_id: ks2_wf_id,
        order_execution_group: 0,
        hierarchy: '0.0',
        ks2_type_id: newType.id,
        ks3_workflow_id: ks2_info.ks3_workflow_id,
        side_id: groupInfo.side_id
      })
      const newGroup = await this.ks2WorkflowTypeGroupRepository.save(createGroup)
      // Получаем информацию по пользователям
      for(let u of i.user_email) {
        emailList.push(u)
        const userInfo = await this.userService.getUserByEmail(u)
        // Добавляем пользователей
        const createUser = await this.ks2WorkflowTypeGroupUserRepository.create({
          full_name: userInfo.full_name,
          login: userInfo.login,
          email: userInfo.email,
          department: userInfo.department,
          position: userInfo.position,
          ks2_workflow_id: ks2_wf_id,
          ks2_type_id: newType.id,
          ks2_group_id: newGroup.id,
          order_execution_user: 0,
          hierarchy: '0.0.0',
          ks3_workflow_id: ks2_info.ks3_workflow_id,
          creator: author.Email
        })
        await this.ks2WorkflowTypeGroupUserRepository.save(createUser)
      }
    }
    // Оставляем только уникальные email
    emailList = [...new Set(emailList)]
    // Параметры
    const textBody = await this.mailingService.getGeneralTemplate(ks3id)
    const theme = `Согласование актов КС-2 АЭС "Аккую" | Approval of the KS-2 certificates "Akkuyu" NPP`
    const text = {
      text_ru: `Вас назначили согласантом актов КС-2`,
      text_en: `You have been appointed as a coordinator of the KS-2 certificate`
    }
    let emailListPrepare = []
    for(let i of emailList) {
      // Добавляем внутреннее уведомление
      await this.notificationService.create(i, text)
      emailListPrepare.push({Email: i})
    }
    const sendData = {
      ListEmails: emailListPrepare,
      Subject: theme,
      MessageText: textBody,
      ks2_id: null,
      ks3_id: ks3id,
      ks2_workflow_id: null,
      ks3_workflow_id: ks3wfid,
      author_email: author.DB.email
    }
    const sendEmail = await this.mailingService.sendMail(sendData)
    // Проставляем индикатор
    if(sendEmail.code) {
      for(let e of emailList) {
        await this.ks2WorkflowTypeGroupUserRepository
          .createQueryBuilder('ks2_users')
          .update()
          .set({ mail_code: sendEmail.code })
          .where('email = :email', { email: e })
          .andWhere('ks2_workflow_id = :ks2_workflow_id', { ks2_workflow_id: ks2_info.id })
          .andWhere('ks2_type_id = :ks2_type_id', { ks2_type_id: newType.id })
          .execute()
      }
    }
    return {
      success: true,
      data: sendEmail
    }
  }

  // Удалить согласующего из списка согласовантов КС-2
  async removeexec(body, author) {
    const params = body.params
    // Проверяем не подписано ли
    const checkNoComplete = await this.ks2WorkflowTypeGroupRepository.findOne({
      where: {
        id: params.group_id,
        complete: false
      }
    })
    // Если группа еще не завершилась
    if(checkNoComplete) {
      // Удаляем группу
      await this.ks2WorkflowTypeGroupRepository.delete({
        id: params.group_id
      })
      // Проверяем, если группа последняя, то удаляем тип
      const checkType = await this.ks2WorkflowTypeRepository.findOne({
        relations: ['ks2_groups'],
        where: { id: params.ks2_type_id }
      })
      if(checkType.ks2_groups.length === 0) {
        await this.ks2WorkflowTypeRepository.delete({
          id: params.ks2_type_id
        })
      }
      // Проверяем, активен ли следующий согласовант
      const ks2_wf = await this.ks2WorkflowRepository
        .createQueryBuilder('ks2wf')
        .leftJoinAndSelect('ks2wf.ks2_types', 'ks2_types')
        .leftJoinAndSelect('ks2_types.ks2_groups', 'ks2_groups')
        .leftJoinAndSelect('ks2_groups.ks2_users', 'ks2_users')
        .where('ks2wf.id = :ks2_wf_id', {ks2_wf_id: params.ks2_wf_id})
        .orderBy({
          'ks2_types.order_execution_type': 'ASC',
          'ks2_groups.order_execution_group': 'ASC'
        })
      .getOne()
      // Проверяем остался ли еще активный тип
      const activeType = ks2_wf.ks2_types.find(t => t.action && !t.complete)
      const noActiveType = ks2_wf.ks2_types.find(t => !t.action && !t.complete)
      // Если нет активных типов
      if(!activeType && ks2_wf.ks2_types.length > 0) {
        if(noActiveType) {
          // Активитуем следующий тип
          await this.ks2WorkflowTypeRepository.update({
            id: noActiveType.id,
            action: false,
            complete: false
          },{ action: true })
          // Находим ближайшие группы
          const nexOrderGroups = noActiveType.ks2_groups[0].order_execution_group
          for(let g of noActiveType.ks2_groups) {
            if(g.order_execution_group === nexOrderGroups) {
              await this.ks2WorkflowTypeGroupRepository.update({
                id: g.id,
                action: false,
                complete: false
              },{ action: true })
            }
          }
        } else {
          // Есть готовые согласования
          let statusCompleted
          if(ks2_wf.code === 'ks2_approv') {
            // Нужно закрыть WF со статусом Согласовано
            statusCompleted = await this.ks2StatusRepository.findOne({
              where: { code: 'agreed' }
            })
          } else if(ks2_wf.code === 'ks2_sign') {
            // Нужно закрыть WF со статусом Подписан
            statusCompleted = await this.ks2StatusRepository.findOne({
              where: { code: 'signed' }
            })
          }
          await this.ks2Repository.update({
            id: params.ks2_id
          },{
            ks2_status_id: statusCompleted.id
          })
          // Ставим индикатор Выполнено
          await this.ks2WorkflowRepository.update(ks2_wf.id, {
            started: false,
            complete: true
          })
        }
      }
      // Если удалили последний тип и группу в КС-2
      else {
        const ks2_wf = await this.ks2WorkflowRepository
          .createQueryBuilder('ks2wf')
          .leftJoinAndSelect('ks2wf.ks2_types', 'ks2_types')
          .leftJoinAndSelect('ks2_types.ks2_groups', 'ks2_groups')
          .leftJoinAndSelect('ks2_groups.ks2_users', 'ks2_users')
          .where('ks2wf.id = :ks2_wf_id', {ks2_wf_id: params.ks2_wf_id})
          .orderBy({
            'ks2_types.order_execution_type': 'ASC',
            'ks2_groups.order_execution_group': 'ASC'
          })
        .getOne()
        if(!activeType && !noActiveType) {
          // Нет готовых согласований
          let statusCompleted
          if(ks2_wf.code === 'ks2_approv') {
            // Нужно закрыть WF со статусом Проект
            statusCompleted = await this.ks2StatusRepository.findOne({
              where: { code: 'project' }
            })
          } else if(ks2_wf.code === 'ks2_sign') {
            // Нужно закрыть WF со статусом Согласовано
            statusCompleted = await this.ks2StatusRepository.findOne({
              where: { code: 'agreed' }
            })
          }
          await this.ks2Repository.update({
            id: params.ks2_id
          },{
            ks2_status_id: statusCompleted.id
          })
          // Ставим индикатор Не запущено и не выполнено
          await this.ks2WorkflowRepository.update(ks2_wf.id, {
            started: false,
            complete: false
          })
        } else {
          const activeType = ks2_wf.ks2_types.find(t => t.action && !t.complete)
          const activeGroup = activeType.ks2_groups.find(g => !g.action && !g.complete)
          // Если тип еще активен
          if(activeGroup) {
            // Находим ближайшие группы
            const nexOrderGroups = activeType.ks2_groups[0].order_execution_group
            for(let g of activeType.ks2_groups) {
              if(g.order_execution_group === nexOrderGroups) {
                await this.ks2WorkflowTypeGroupRepository.update({
                  id: g.id,
                  action: false,
                  complete: false
                },{ action: true })
              }
            }
          }
          // Если больше нет не запущенных групп
          else if(!activeType) {
            await this.ks2WorkflowTypeRepository.update({
              id: activeType.id
            },{
              action: false,
              complete: true
            })
            const noActiveType = ks2_wf.ks2_types.find(t => !t.action && !t.complete)
            await this.ks2WorkflowTypeRepository.update({
              id: noActiveType.id,
              action: false
            },{
              action: true
            })
            // Находим ближайшие группы
            const nexOrderGroups = noActiveType.ks2_groups[0].order_execution_group
            for(let g of noActiveType.ks2_groups) {
              if(g.order_execution_group === nexOrderGroups) {
                await this.ks2WorkflowTypeGroupRepository.update({
                  id: g.id,
                  action: false,
                  complete: false
                },{ action: true })
              }
            }
          }
        }
      }
    } else {
      return {
        success: false,
        message: 'Can\'t delete. Already agreed by this participant'
      }
    }
    return {
      success: true
    }
  }

  // Добавление замечания
  async addremark(body, author) {
    const data = body.data
    const createRemark = await this.ks2HistoryRepository.create({
      ks2_id: data.ks2_id,
      text: data.textRemark,
      author_email: author.Email,
      user_id: author.DB.id,
      ks2_group_id: data.group_id,
      ks2_workflow_id: data.ks2_wf_id
    })
    const newRemaark = await this.ks2HistoryRepository.save(createRemark)
    // Меняем статус на Устранение замечаний
    const statusFixing = await this.ks2StatusRepository.findOne({
      where: { code: 'fixing' }
    })
    await this.ks2Repository.update({
      id: data.ks2_id
    },{
      ks2_status_id: statusFixing.id
    })
    return {
      success: true,
      data: newRemaark
    }
  }

  // Закрыть замечание
  async eliminatingremark(body, author) {
    const user = await this.userService.getUserByEmail(author.Email)
    const data = body.data
    await this.ks2HistoryRepository.update({
      id: data.id
    }, {
      action: false,
      complete: true,
      answer_id: user.id,
      answer_email: author.Email,
      closed_at: moment(new Date()).add(3, 'hours').toDate()
    })
    // Проверяем, есть ли еще не закрытые замечания
    const remark = await this.ks2HistoryRepository.find({
      where: {
        ks2_id: data.ks2_id,
        action: true,
        complete: false
      }
    })
    if(remark.length === 0) {
      // Находим выполняющийся wf
      const ks2wf = await this.ks2WorkflowRepository.find({
        where: {
          ks2_id: data.ks2_id
        }
      })
      const currentWf = ks2wf.find(wf => !wf.complete)
      // Меняем статус
      let statusCode
      if(currentWf.code === 'ks2_approv') {
        statusCode = 'approval'
      } else {
        statusCode = 'signing'
      }
      const status = await this.ks2StatusRepository.findOne({
        where: { code: statusCode }
      })
      await this.ks2Repository.update({
        id: data.ks2_id
      },{
        ks2_status_id: status.id
      })
    }
    return {
      success: true
    }
  }

  // Добавить комментарий участника согласования к КС-2
  async addcomment(body, author) {
    const params = body.params
    const ks2_wf = await this.ks2Repository.findOne(params.ks2_id, {
      relations: ['ks2_workflow']
    })
    const currentWf = ks2_wf.ks2_workflow.find(wf => wf.started && !wf.complete)
    const lastWf = ks2_wf.ks2_workflow[ks2_wf.ks2_workflow.length - 1]
    const author_id = await this.userService.getUserByEmail(author.Email)

    const newComment = await this.ks2CommentsRepository.save({
      comment: params.comment,
      ks2_id: params.ks2_id,
      ks2_workflow_id: currentWf ? currentWf.id : lastWf.id,
      ks2_group_code: params.code,
      author_email: author.Email,
      author_id: author_id.id
    })

    return {
      success: true,
      data: newComment
    }
  }

  // Удалить комментарий участника согласования к КС-2
  async delcomment(id, author) {
    await this.ks2CommentsRepository.delete(id)
    return {
      success: true
    }
  }
}