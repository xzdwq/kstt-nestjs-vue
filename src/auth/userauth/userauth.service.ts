import { Injectable, HttpService, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserAuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private http: HttpService,
    private configService: ConfigService
  ) {}

  async checkADFSUser(token: string, username: string, password: string): Promise<any> {
    const user = new Promise<object>((res, rej) => {

      const userNamePassBase64 = Buffer.from(username+':'+password).toString('base64')
      const urlencoded = new URLSearchParams()
      urlencoded.append('', userNamePassBase64)

      const headersRequest = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      };
      const url = this.configService.get('databus_url')

      this.http.post(
        `${url}/api/users/auth`,
        urlencoded,
        { headers: headersRequest }
      )
      .subscribe((resp) => {
        if(!resp.data.success) this.logger.log(`${username} failed auth`, UserAuthService.name)
        res(resp.data)
      })
    })
    return user
  }
}