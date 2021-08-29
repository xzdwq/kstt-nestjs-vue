import {
  Injectable
} from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { KS2Entity } from '@src/ks/ks2/entity/ks2.entity';

const xlsx = require("xlsx");
const reader = require('xlsx')

@Injectable()
export class KS2Service {
  constructor(
    @InjectRepository(KS2Entity)
    private ks2Repository: Repository<KS2Entity>,
  ) {}

  async uploadKS2File(body) {
    // console.log(body)
    const workBook = xlsx.read(body.file.buffer, {
        raw: false,
        header: 1,
        cellDates: true,
        dateNF: 'yyyy-mm-dd',
        blankrows: false,
      });
    const workSheet = workBook.Sheets[workBook.SheetNames[0]]

    // const fileData = xlsx.utils.sheet_to_json(workSheet, {
    //   raw: false,
    //   header: 1,
    //   dateNF: 'yyyy-mm-dd',
    //   blankrows: false,
    // })

    // console.log(fileData)

    // let data = []
    // let file = xlsx.read(body.file.buffer);
    // const sheets = file.SheetNames
    // for(let i = 0; i < sheets.length; i++)
    // {
    //   const temp = reader.utils.sheet_to_json(
    //         file.Sheets[file.SheetNames[i]])
    //   temp.forEach((res) => {
    //       data.push(res)
    //   })
    // }
    // // Printing data
    // console.log(data)
    let data: any = {}

    data.user_id = 1;
    data.ks3_id = +body.ks3_id;

    for(let cell in workSheet) {
      const cellString = cell.toString()
      // Номер акта - act_number
      if(cellString === 'N18') {
        data.act_number = workSheet[cell].v
      }
      // Дата акта - act_date
      if(cellString === 'N20') {
        data.act_date = new Date(workSheet[cell].v)
      }
      // Номер документа - document_number
      if(cellString === 'K25') {
        data.document_number = workSheet[cell].v
      }
      // Дата составления - date_preparation
      if(cellString === 'L25') {
        data.date_preparation = new Date(workSheet[cell].v)
      }
      // Отчетный период - reporting_period
      if(cellString === 'M25') {
        data.reporting_period = new Date(workSheet[cell].v)
      }
      // Номер сметы
      if(cellString === 'C27') {
        data.estimate_number = workSheet[cell].v
      }
    }

    const ks2 = await this.ks2Repository.create({...data})
    const result = await this.ks2Repository.save(ks2)

    return {
      success: true,
      data: result
    }
  }

  async getKS2ByKS3Id(id) {
    const [data, total] = await this.ks2Repository.findAndCount({
      where: {
        ks3_id: id
      }
    })
    return {
      success: true,
      data: data,
      total: total
    }
  }
}