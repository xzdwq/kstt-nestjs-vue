import {
  Injectable,
  HttpService
} from "@nestjs/common";
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { ConfigService } from '@nestjs/config';
import { TokenService } from '@src/auth/token/token.service'

@Injectable()
export class ExcelToPDFService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}
  // Локальный метод
  async onExcelToPDF(data) {
    // console.log(data)
  }
  // Удаленный сервер
  async onExcelToPDFRemote(dataForPdf) {
    const file = dataForPdf.file
    // console.log(dataForPdf)
    // Конвертируем файл в base64
    // const fileBase64 = fs.readFileSync(path, {encoding: 'base64'});
    // console.log(fileBase64)
    const fileBase64: any = await this.onConverFileToBase64(file.buffer)
    
    // Сервис конвертации
    const token = await this.tokenService.checkDBToken('databus');

    const urlencoded = new URLSearchParams()
    urlencoded.append('File', fileBase64)
    urlencoded.append('FileName', file.originalName)
    urlencoded.append('Ext', dataForPdf.dataToSave.ext)
    const headersRequest = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token.token}`,
    };

    const url = this.configService.get('databus_url')
    const remoteConverter = await this.http.post(
      `${url}/api/convert/excel/pdf`,
      urlencoded,
      { headers: headersRequest }
    )
    .toPromise()
    .then((resp) => {
        /**
         * Success:      boolean
         * Message:      string
         * File:         string: 'PDF in base64'
         * FileName:     string
         * Ext:          string: 'pdf'
         * TotalSecond:  string
         */
        return resp.data
    })
    .catch((e) => {
      console.log('Error convert excel to pdf: ', e.toString())
    })
    // Сохраняем файл
    if(remoteConverter.Success) {
      const binPdf = Buffer.from(remoteConverter.File, 'base64');
      const upload_location = this.configService.get('upload_location')
      const uuid = uuidv4(),
            dir = upload_location+'/'+dataForPdf.dir
      // Сначала создаем многовложенные папки всего пути под файл
      fs.mkdirSync(dir, { recursive: true });
      // Теперь сохраняем файл по пути
      const path = dir+'/'+uuid+'.'+remoteConverter.Ext
      fs.writeFileSync(path, binPdf);
      // Получаем информацию по сохраненному файлу
      const stat = fs.statSync(path);
      // Меняем расширение фала
      const decorNameFile = dataForPdf.dataToSave.name.replace(dataForPdf.dataToSave.ext, remoteConverter.Ext)
      return {
        success: true,
        uuid: uuid,
        name: decorNameFile,
        path: path,
        size: stat.size,
        ext: remoteConverter.Ext,
        mimetype: 'application/pdf',
        ks2_id: +dataForPdf.dataToSave.ks2_id,
        ks3_id: +dataForPdf.dataToSave.ks3_id,
        ks3_workflow_id: +dataForPdf.dataToSave.ks3_workflow_id,
        version: dataForPdf.version
      }
    }
    return {
      success: false
    }
  }

  // Конвертация файла в Base64
  async onConverFileToBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const b64file = file.toString('base64')
      resolve(b64file)
    })
  }
}