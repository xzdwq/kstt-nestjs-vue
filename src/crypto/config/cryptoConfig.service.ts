import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as fs from 'fs'
import * as path from 'path';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
const fontkit = require('@pdf-lib/fontkit')
const { PdfReader } = require('pdfreader')
import * as moment from 'moment';

import { ConfigService } from '@nestjs/config'
import { SignatureTypeEntity } from './entity/signatureType.entity'

@Injectable()
export class CryptoConfigService {
  constructor(
    @InjectRepository(SignatureTypeEntity)
    private signatureTypeRepository: Repository<SignatureTypeEntity>,
    // Конфигурации
    @Inject(ConfigService)
    private configService: ConfigService,
  ){}

  async getSignaturesType() {
    const [data, total] = await this.signatureTypeRepository.findAndCount();

    return {
      success: true,
      data: data,
      total: total
    }
  }

  // Получаем путь бланка для теста подписи
  async getTestPath() {
    const upload_location = this.configService.get('upload_location')
    const dir = upload_location+'/'+'assets/testFormPdf'
    const pdfFile = 'default.pdf'
    fs.mkdirSync(dir, { recursive: true })
    // const files = fs.readdirSync(dir)
    // let pdfFile= null
    // for(let file of files) {
    //   if(file.match(/[0-9a-z]+$/i)[0] === 'pdf') {
    //     pdfFile = file
    //     break
    //   }
    // }
    const path = dir+'/'+pdfFile
    return path
  }

  // Тест подписи
  async testSign(params) {
    const filePath = params.path
    const cert = params.cert
    if(filePath) {
      const padBuffer = fs.readFileSync(filePath)
      // Ищем координаты ключевого слова
      /**
       * @param {padBuffer} - ArrayBuffer
       * @param {string} - Ключевое слово поиска совпадения
       * @param {numberPage} - Номер страницы на которой ищем (необязательный артумент)
       */
      const matchPhrasePdf = await this.findCoordinateInPdf(padBuffer, 'Место подписи', 1)

      const pdfDoc = await PDFDocument.load(padBuffer)

      // const pdfUtf = fs.readFileSync(filePath, {encoding: 'utf8' })
      // console.log(pdfUtf)

      pdfDoc.registerFontkit(fontkit)
      // Определяем кириллический шрифт
      const fontPathLigth = path.resolve('.', 'assets/font/OpenSans/OpenSans-Light.ttf')
      const fontPathBold = path.resolve('.', 'assets/font/OpenSans/OpenSans-Bold.ttf')
      const fontPathItalic = path.resolve('.', 'assets/font/OpenSans/OpenSans-Italic.ttf')

      const fontCyryllicLight = new Uint8Array(fs.readFileSync(fontPathLigth).buffer)
      const fontCyryllicBold = new Uint8Array(fs.readFileSync(fontPathBold).buffer)
      const fontCyryllicItalic = new Uint8Array(fs.readFileSync(fontPathItalic).buffer)

      const openSansLight = await pdfDoc.embedFont(fontCyryllicLight)
      const openSansBold = await pdfDoc.embedFont(fontCyryllicBold)
      const openSansItalic = await pdfDoc.embedFont(fontCyryllicItalic)

      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()
      const textSize = 8
      const rgbBlack = rgb(0, 0, 0)
      // console.log('Page', {
      //   width: width+'pt',
      //   height: height+'pt'
      // })
      // console.log('Phrase', {
      //   x: matchPhrasePdf[0].x,
      //   y: matchPhrasePdf[0].y,
      //   fitX: ((matchPhrasePdf[0].x * 10) * 3) / 4,
      //   fitY: (((matchPhrasePdf[0].y * 10) * 3) / 4) - 130,
      //   w: matchPhrasePdf[0].w,
      //   sw: matchPhrasePdf[0].sw
      // })
      // console.log(matchPhrasePdf[0])
      // Рамка
      // x: 80, y: 160,
      firstPage.drawRectangle({
        x: 80,
        y: 225,
        width: 250,
        height: 40,
        borderColor: rgbBlack,
        borderWidth: 1,
      })
      // Текст
      firstPage.drawText(`${cert.company || ''} ${cert.department}`, {
        x: 85,
        y: 250,
        size: textSize,
        font: openSansLight,
        color: rgbBlack
      })
      firstPage.drawText(`Сертификат: ${cert.serialNumber}`, {
        x: 85,
        y: 240,
        size: textSize,
        font: openSansLight,
        color: rgbBlack
      })
      firstPage.drawText(`Подписан: ${cert.name} ${moment(new Date()).format('DD.MM.YYYY HH:mm')}`, {
        x: 85,
        y: 230,
        size: textSize,
        font: openSansLight,
        color: rgbBlack
      })

      const pdfBytes = await pdfDoc.save()
      const fileName = filePath.split('/').pop(),
            ext = fileName.match(/[0-9a-z]+$/i)[0],
            newFileName = cert.serialNumber+'_'+cert.name.replace(/ /g, '_')+'.'+ext,
            newPath = filePath.replace(fileName, newFileName)

      fs.writeFileSync(newPath, pdfBytes)
      return newPath
    }
    return filePath
  }

  // Поиск в PDF координат ключевого слова
  async findCoordinateInPdf(padBuffer, string, numberPage) {
    const reader = new PdfReader()

    let pages = [], pageW, pageH
    const result = new Promise<any[]>((resolve, reject) => {
      reader.parseBuffer(padBuffer, (err, item) => {
        if(err) { reject(err) }
        else if(!item) { resolve(pages) }
        else if(item.page) {
          pages.push({})
          pageW = item.width
          pageH = item.height
        }
        else if(item.text) {
          let row = []
          if(
            !Array.isArray(pages[pages.length-1][item.y])
            && pages[pages.length-1][item.y]
          ) {
            row = pages[pages.length-1][item.y].row
          } else { row = [] }
          // const row = pages[pages.length-1][item.y] || []
          row.push(item.text)
          const string = row.join(' ')
          // Координаты обновляются для каждого слова
          // поэтому мы берем только для начала строки
          if(!pages[pages.length-1][item.y]) {
            pages[pages.length-1][item.y] = {
              page: pages.length,
              pageW: pageW,
              pageH: pageH,
              row: [string],
              x: item.x,
              y: item.y,
              w: item.w,
              sw: item.sw
            }
          } else {
            pages[pages.length-1][item.y].row = [string]
            pages[pages.length-1][item.y].w += item.w
          }
        }
      })
    })
    let match = []
    if(Array.isArray(await result)) {
      if(numberPage) pages = [pages[numberPage-1]]
      // Цикл по страницам
      for(let p = 0; p < pages.length; p++) {
        // Цикл по строкам внутри страницы
        for(let s in pages[p]) {
          if(pages[p][s].row[0].includes(string)) {
            match.push({
              page: pages[p][s].page,
              pageW: pages[p][s].pageW,
              pageH: pages[p][s].pageH,
              x: pages[p][s].x,
              y: pages[p][s].y,
              w: pages[p][s].w,
              sw: pages[p][s].sw,
              inputString: string,
              outputString: pages[p][s].row[0]
            })
          }
        }
      }
    }
    return match
  }
}