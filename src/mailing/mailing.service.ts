import {
  Injectable,
  HttpService
} from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

import { ConfigService } from '@nestjs/config';
import { TokenService } from '@src/auth/token/token.service'
import { MailingEntity } from '@src/mailing/entity/mailing.entity';

@Injectable()
export class MailingService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
    private tokenService: TokenService,
    @InjectRepository(MailingEntity)
    private mailingRepository: Repository<MailingEntity>,
  ) {}

  // Рассылка писем
  async sendMail(model) {
    /** object
     * @param {EmailFrom: string} адрес с которого будет происходит рассылка
     * @param {ListEmails: array} [{ Email: a@a.ru }] адресаты
     * @param {Subject: string} тема письма
     * @param {MessageText: string} тело письма (поддерживает формат html)
     * @param {Link: string} ссылка для кнопки перехода (необязательно)
     */
    const email_from = this.configService.get('email_from')
    const datModel: any = {
      EmailFrom: email_from,
      ListEmails: model.ListEmails,
      Subject: model.Subject,
      MessageText: model.MessageText
    }

    if(model.Link) datModel.Link = model.Link

    const token = await this.tokenService.checkDBToken('databus')
    const url = this.configService.get('databus_url')

    const headersRequest = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${token.token}`,
    };

    const remoteMailingSend: any = await this.http.post(
      `${url}/api/add`,
      datModel,
      { headers: headersRequest }
    )
      .toPromise()
      .then((resp) => {
        return {
          success: true,
          code: resp.data
        }
      })
      .catch(e => {
        return {
          success: false,
          message: e.response?.data?.Message || 'Error sending message'
        }
      })

    const listEmails = model.ListEmails.map(i => i.Email)
    const newMailing = await this.mailingRepository.create({
      message_code: remoteMailingSend.code || null,
      list_emails: listEmails.join(','),
      theme: model.Subject,
      ks2_id: model.ks2_id,
      ks3_id: model.ks3_id,
      ks2_workflow_id: model.ks2_workflow_id,
      ks3_workflow_id: model.ks3_workflow_id,
      author_email: model.author_email,
      etc: remoteMailingSend.message
    })
    const mailing = await this.mailingRepository.save(newMailing)

    return {
      success: remoteMailingSend.success,
      code: remoteMailingSend.code || null,
      message: remoteMailingSend.message || null,
      data: mailing
    }
  }

  // Общий шаблон письма
  async getGeneralTemplate(ks3id) {
    const link_ru = `http://10.55.51.12:3000/#/ks3/${ks3id}?locale=ru`
    const link_en = `http://10.55.51.12:3000/#/ks3/${ks3id}?locale=en`
    const textBody = `
                <p style="font-family: sans-serif; color: #0b6dbc; font-size: 20px;">
                  Портал КС-2/КС-3 АЭС "Аккую" | Информационное сообщение о назначении согласования
                </p>
                <div style="font-family: sans-serif;">
                  <p>Вас назначили участником согласования актов КС-2</p>
                  <a href="${link_ru}">
                    <div>
                      Перейти на страницу согласования
                    </div>
                  </a>
                </div>
                <p style="color: #686868;">Это письмо сформировано автоматически, не отвечайте на него</p>
  
                <hr style="border: none; border-top: 1px solid #686868;">
  
                <p style="font-family: sans-serif; color: #0b6dbc; font-size: 20px;">
                  KS-2/KS-3 portal of "Akkuyu" NPP | Information message about the appointment of approval
                </p>
                <div style="font-family: sans-serif;">
                  <p>You have been appointed to approve the KS-2 certificates</p>
                  <a href="${link_en}">
                    <div>
                      Go to the approval page
                    </div>
                  </a>
                </div>
                <p style="color: #686868;">This email is generated automatically, do not reply to it</p>
                <hr style="border: none; border-top: 1px solid #686868;">
              `.replace(/\n/g, ' ').replace(/ +/g, ' ').trim()
    return textBody
  }
  // Шаблон письма под конкретную КС-2
  async getKS2Template(params) {
    const date_preparation_ru = params.date_preparation_ru,
          subcontract_date_ru = params.subcontract_date_ru,
          date_preparation_en = params.date_preparation_en,
          subcontract_date_en = params.subcontract_date_en,
          document_number = params.document_number,
          estimate_number = params.estimate_number,
          subcontract_number = params.subcontract_number,
          ks2_groups_name_ru = params.ks2_groups_name_ru,
          ks2_groups_name_en = params.ks2_groups_name_en,
          link_ru = `http://10.55.51.12:3000/#/ks2/${params.ks2_id}?locale=ru`,
          link_en = `http://10.55.51.12:3000/#/ks2/${params.ks2_id}?locale=en`
    const textBody = `
              <p style="font-family: sans-serif; color: #0b6dbc; font-size: 20px;">
                Портал КС-2/КС-3 АЭС Аккую | Информационное сообщение о назначении согласования
              </p>
              <div style="font-family: sans-serif;">
                <p>Вас назначили участников согласования акта КС-2 <b>№ ${document_number}</b> от <b>${date_preparation_ru}</b></p>
                <p>
                  Смета <b>${estimate_number}</b><br>
                  Договор подряда <b>№ ${subcontract_number}</b> от <b>${subcontract_date_ru}</b>
                </p>
                <p>Группа рассылки: <b>${ks2_groups_name_ru}</b></p>
                <a href="${link_ru}">
                  <div>
                    Перейти на страницу согласования
                  </div>
                </a>
              </div>
              <p style="color: #686868;">Это письмо сформировано автоматически, не отвечайте на него</p>

              <hr style="border: none; border-top: 1px solid #686868;">

              <p style="font-family: sans-serif; color: #0b6dbc; font-size: 20px;">
                KS-2/KS-3 portal of Akkuyu NPP | Information message about the appointment of approval
              </p>
              <div style="font-family: sans-serif;">
                <p>You have been appointed to approve the KS-2 certificate <b>№ ${document_number}</b> of <b>${date_preparation_en}</b></p>
                <p>
                  Estimate <b>${estimate_number}</b><br>
                  Subcontract <b>№ ${subcontract_number}</b> of <b>${subcontract_date_en}</b>
                </p>
                <p>Distribution group: <b>${ks2_groups_name_en}</b></p>
                <a href="${link_en}">
                  <div>
                    Go to the approval page
                  </div>
                </a>
              </div>
              <p style="color: #686868;">This email is generated automatically, do not reply to it</p>
              <hr style="border: none; border-top: 1px solid #686868;">
            `.replace(/\n/g, ' ').replace(/ +/g, ' ').trim()
    return textBody
  }
}