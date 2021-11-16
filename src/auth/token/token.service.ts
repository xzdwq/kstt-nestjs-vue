import { Injectable, HttpService, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { TokenEntity } from '@src/auth/token/token.entity';

@Injectable()
export class TokenService {
  constructor(
    private http: HttpService,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    @Inject(ConfigService)
    private configService: ConfigService
  ){}

  async getToken(): Promise<string> {
    const databus = 'databus'
    const tokenCheck = await this.checkDBToken(databus)
    const token = tokenCheck.token;
    return token
  }

  async checkDBToken(service: string) {
    const tokenCheck = await this.tokenRepository.findOne({ where: { service } })
    if(!tokenCheck) {
      return await this.mutation(service, 'create')
    } else {
      if(new Date() >= new Date(tokenCheck.expires)) {
        return await this.mutation(service, 'update');
      } else {
        return tokenCheck
      }
    }
  }

  async mutation(service: string, action: string) {
    const code = this.configService.get('databus_code')
    const url = this.configService.get('databus_url')
    const token = await this.http.get(`${url}/api/token/${code}`)
      .toPromise()
      .then((resp) => {
        let newToken
        if(action === 'create') {
          newToken = this.tokenRepository.create({
            token: resp.data.token,
            expires: resp.data.expires,
            service: service
          })
          this.tokenRepository.save(newToken)
        }
        else if(action === 'update') {
          this.tokenRepository.update({ service }, {
            token: resp.data.token,
            expires: resp.data.expires
          })
          newToken = this.tokenRepository.findOne({ service })
        }
        return newToken
      })
      .catch((e) => {
        console.log('TokenService: ', e.toString())
      })
    return token
  }
}